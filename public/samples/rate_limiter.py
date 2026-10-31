"""
Token-bucket rate limiting for the Northwind forecasting API.

Each API key gets its own bucket. A request takes one token; if the bucket is
empty the request is rejected with the number of seconds until a token is
available again.
"""

import threading
import time
from dataclasses import dataclass, field
from functools import wraps

DEFAULT_CAPACITY = 20
DEFAULT_REFILL_RATE = 0.5  # tokens per second, so 30 requests a minute once the burst is used up
IDLE_BUCKET_TTL_SECONDS = 600


class RateLimitExceeded(Exception):
    """Raised when a caller has no tokens left."""

    def __init__(self, key: str, retry_after: float):
        self.key = key
        self.retry_after = retry_after
        super().__init__(f"Rate limit exceeded for {key}. Retry after {retry_after:.1f}s.")


@dataclass
class TokenBucket:
    """A bucket that holds up to `capacity` tokens and refills continuously.

    Refilling is lazy: nothing runs in the background. Each time the bucket is
    used, it works out how much time has passed since it was last refilled and
    adds `elapsed * refill_rate` tokens, never going above `capacity`.
    """

    capacity: int = DEFAULT_CAPACITY
    refill_rate: float = DEFAULT_REFILL_RATE
    tokens: float = field(init=False)
    last_refill: float = field(init=False)

    def __post_init__(self) -> None:
        if self.capacity <= 0 or self.refill_rate <= 0:
            raise ValueError("capacity and refill_rate must be positive")
        self.tokens = float(self.capacity)
        self.last_refill = time.monotonic()

    def _refill(self) -> None:
        now = time.monotonic()
        elapsed = now - self.last_refill
        self.tokens = min(self.capacity, self.tokens + elapsed * self.refill_rate)
        self.last_refill = now

    def try_consume(self, tokens: int = 1) -> float:
        """Take `tokens` from the bucket.

        Returns 0 if the tokens were taken. Otherwise takes nothing and returns
        the number of seconds until enough tokens will be available.
        """
        self._refill()
        if self.tokens >= tokens:
            self.tokens -= tokens
            return 0.0
        missing = tokens - self.tokens
        return missing / self.refill_rate


class RateLimiter:
    """Keeps one TokenBucket per key and evicts buckets that have gone idle."""

    def __init__(
        self,
        capacity: int = DEFAULT_CAPACITY,
        refill_rate: float = DEFAULT_REFILL_RATE,
        idle_ttl: float = IDLE_BUCKET_TTL_SECONDS,
    ):
        self.capacity = capacity
        self.refill_rate = refill_rate
        self.idle_ttl = idle_ttl
        self._buckets: dict[str, TokenBucket] = {}
        self._lock = threading.Lock()

    def check(self, key: str, cost: int = 1) -> None:
        """Charge `cost` tokens to `key`, or raise RateLimitExceeded."""
        with self._lock:
            self._evict_idle()
            bucket = self._buckets.get(key)
            if bucket is None:
                bucket = TokenBucket(self.capacity, self.refill_rate)
                self._buckets[key] = bucket
            retry_after = bucket.try_consume(cost)

        if retry_after > 0:
            raise RateLimitExceeded(key, retry_after)

    def _evict_idle(self) -> None:
        # With the defaults a bucket refills completely in 40 seconds, so one
        # idle for idle_ttl seconds is full again and can be dropped safely:
        # recreating it later gives the same result.
        cutoff = time.monotonic() - self.idle_ttl
        idle = [key for key, bucket in self._buckets.items() if bucket.last_refill < cutoff]
        for key in idle:
            del self._buckets[key]


def rate_limited(limiter: RateLimiter, key_arg: str = "api_key", cost: int = 1):
    """Decorator that rate-limits a function by one of its keyword arguments.

    Example:
        limiter = RateLimiter(capacity=5, refill_rate=1)

        @rate_limited(limiter)
        def get_forecast(store_id: str, *, api_key: str) -> dict:
            ...
    """

    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            key = kwargs.get(key_arg)
            if key is None:
                raise TypeError(f"{func.__name__}() needs a '{key_arg}' keyword argument")
            limiter.check(key, cost)
            return func(*args, **kwargs)

        return wrapper

    return decorator

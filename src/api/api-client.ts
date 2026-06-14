import { settings } from "@/config/configs.ts";

// Shared in-memory map so duplicate requests can reuse the same promise.
let activeRequestMap: Map<string, Promise<unknown>> | null = null;

// Browser environment check.
const isBrowser = typeof window !== "undefined";

/**
 * Returns the shared request map, or a temporary one during SSR/Node usage.
 */
const getRequestMap = (): Map<string, Promise<unknown>> => {
	if (!isBrowser) return new Map();
	if (!activeRequestMap) activeRequestMap = new Map();

	return activeRequestMap;
};

interface HeadersRecord {
	[key: string]: string;
}

function isFormDataBody(value: unknown): value is FormData {
	return typeof FormData !== "undefined" && value instanceof FormData;
}

function removeContentTypeHeader(headers: HeadersRecord): HeadersRecord {
	const normalized: HeadersRecord = { ...headers };
	for (const key of Object.keys(normalized)) {
		if (key.toLowerCase() === "content-type") {
			delete normalized[key];
		}
	}
	return normalized;
}

function serializeBodyForRequestKey(body: unknown): string {
	if (body == null) return "";

	if (isFormDataBody(body)) {
		const entries: string[] = [];
		for (const [key, value] of body.entries()) {
			if (typeof value === "string") {
				entries.push(`${key}:${value}`);
				continue;
			}

			entries.push(`${key}:[file:${value.name}:${value.size}:${value.type}]`);
		}

		entries.sort();
		return `form:${entries.join("|")}`;
	}

	return stableSerialize(body);
}

/**
 * Base URL used to build every DocuChat API request.
 */
const BASE_URL = settings.api.BASE_URL;

function getSafeBaseUrl(rawBaseUrl: string): string {
	if (!rawBaseUrl) return "";
	const normalized = rawBaseUrl.trim();
	if (!normalized || normalized === "undefined" || normalized === "null") return "";
	return normalized;
}

function isAbsoluteUrl(value: string): boolean {
	return /^https?:\/\//i.test(value);
}

/**
 * Default headers applied to every request.
 */
const getDefaultHeaders = (): HeadersRecord => ({
	"Content-Type": "application/json",
	"Accept-Version": settings.api.BASE_VERSION,
});

type HttpMethod = "POST" | "GET" | "PATCH" | "PUT" | "DELETE";

const getMethodHeaders = (method: HttpMethod): HeadersRecord => {
	const baseHeaders = getDefaultHeaders();

	// Some endpoints might not want JSON content type (e.g., file uploads)
	switch (method) {
		case "GET":
		case "DELETE": {
			// Remove Content-Type for GET/DELETE as they typically don't have bodies
			const { "Content-Type": _, ...headersWithoutContentType } = baseHeaders;
			return headersWithoutContentType;
		}
		default:
			return baseHeaders;
	}
};

/**
 * Stable-serialize a value so that equivalent objects produce the same string.
 * This is used to build a deterministic request key (prevents double-requesting
 * due to different key order in plain JSON.stringify).
 */
function stableSerialize(value: unknown): string {
	if (value === undefined) return "undefined";
	if (value === null) return "null";
	if (typeof value !== "object") return String(value);

	if (Array.isArray(value)) {
		return `[${value.map(stableSerialize).join(",")}]`;
	}

	// object: sort keys
	const obj = value as Record<string, unknown>;
	const keys = Object.keys(obj).sort();
	const parts = keys.map((k) => `${JSON.stringify(k)}:${stableSerialize(obj[k])}`);
	return `{${parts.join(",")}}`;
}

/**
 * Removes leading and trailing slashes so URL parts can be joined cleanly.
 */
function trimSlashes(s: string = ""): string {
	return String(s).replace(/^\/+|\/+$/g, "");
}

/**
 * Builds a query string while skipping null/undefined values.
 */
function buildQueryString(query: Record<string, unknown> = {}): string {
	const params = new URLSearchParams();

	for (const [key, value] of Object.entries(query)) {
		if (value === undefined || value === null) continue;

		if (Array.isArray(value)) {
			for (const item of value) {
				if (item !== undefined && item !== null) {
					params.append(key, String(item));
				}
			}
			continue;
		}

		params.set(key, String(value));
	}

	return params.toString();
}

/**
 * Combines the base URL, route, endpoint, and query values into one request URL.
 */
function buildUrl(
	route: string = "",
	endpoint: string = "",
	query: Record<string, unknown> = {},
): string {
	const safeBaseUrl = getSafeBaseUrl(BASE_URL);

	// If route is already a full URL, don't prepend API base URL.
	if (isAbsoluteUrl(route)) {
		const routeBase = route.replace(/\/+$/g, "");
		const endpointPart = trimSlashes(endpoint);
		const absoluteUrl = endpointPart ? `${routeBase}/${endpointPart}` : routeBase;
		const absoluteQs = buildQueryString(query);
		return absoluteQs ? `${absoluteUrl}?${absoluteQs}` : absoluteUrl;
	}

	const parts = [safeBaseUrl, route, endpoint].map(trimSlashes).filter(Boolean);

	let base = parts.join("/");

	// If BASE_URL is empty, ensure we start with / for relative URLs
	if (!safeBaseUrl && base && !base.startsWith("/")) {
		base = `/${base}`;
	}

	const qs = buildQueryString(query);
	return qs ? `${base}?${qs}` : base;
}

/**
 * Custom error type so callers can inspect HTTP status and response data.
 */
class HTTPError extends Error {
	status?: number;
	response?: Response;
	data?: unknown;

	constructor(message: string) {
		super(message);
		this.name = "HTTPError";
	}
}

// Request options interface
interface RequestOptions {
	preventDuplicate?: boolean;
	timeoutMs?: number;
	signal?: AbortSignal | null;
	requestKeyOverride?: string | null;
	credentials?: RequestCredentials;
}

// Send request interface
interface SendRequestParams {
	route?: string;
	endpoint?: string;
	method?: HttpMethod;
	query?: Record<string, unknown>;
	body?: unknown;
	headers?: HeadersRecord;
	options?: RequestOptions;
}

/**
 * Sends one request to the API and deduplicates identical in-flight calls.
 */
export async function sendRequest({
	route = "",
	endpoint = "",
	method = "GET",
	query = {},
	body = null,
	headers = {},
	options = {},
}: SendRequestParams): Promise<unknown> {
	const {
		preventDuplicate = true,
		timeoutMs = 0,
		signal: callerSignal = null,
		requestKeyOverride = null,
		credentials = "include",
	} = options;

	const url: string = buildUrl(route, endpoint, query);

	const stableBody: string = serializeBodyForRequestKey(body);
	const computedKey: string = `${(method as string).toUpperCase()}::${url}::${stableBody}`;
	const requestKey: string = requestKeyOverride || computedKey;

	const activeRequests = getRequestMap();

	// Check for existing in-flight request
	if (preventDuplicate && activeRequests.has(requestKey)) {
		console.debug(`[API-CLIENT] Returning existing in-flight request for key: ${requestKey}`);
		return activeRequests.get(requestKey)!;
	}

	// Use caller-provided signal when available so components can cancel.
	const internalController: AbortController | null = !callerSignal ? new AbortController() : null;
	// biome-ignore lint/style/noNonNullAssertion: We ensure internalController is only used when callerSignal is null, so this is safe.
	const signal: AbortSignal = callerSignal || internalController!.signal;

	// Build fetch options
	const methodHeaders = getMethodHeaders(method);
	const mergedHeaders: HeadersRecord = {
		...methodHeaders,
		...headers,
	};

	const optionsFetch: RequestInit = {
		method,
		headers: isFormDataBody(body) ? removeContentTypeHeader(mergedHeaders) : mergedHeaders,
		signal,
		credentials,
	};

	// Add body for methods that support it
	if (body !== null && (method === "POST" || method === "PUT" || method === "PATCH")) {
		if (isFormDataBody(body) || typeof body === "string") {
			optionsFetch.body = body;
		} else {
			optionsFetch.body = JSON.stringify(body);
		}
	}

	let timeoutId: ReturnType<typeof setTimeout> | undefined;

	const fetchPromise: Promise<unknown> = (async () => {
		try {
			// Setup timeout abort
			if (timeoutMs > 0 && internalController) {
				timeoutId = setTimeout(() => {
					console.debug(`[API-CLIENT] Request timeout: ${method.toUpperCase()} ${url}`);
					internalController.abort();
				}, timeoutMs);
			}

			const response: Response = await fetch(url, optionsFetch);

			const data: unknown = await safeParseJson(response);

			// Handle non-2xx responses
			if (!response.ok) {
				const bodyText: string =
					data && typeof data === "object"
						? JSON.stringify(data)
						: String(data || response.statusText);
				const err = new HTTPError(
					`Request failed: ${method.toUpperCase()} ${url} -> ${response.status} ${response.statusText}${bodyText ? ` | ${bodyText}` : ""}`,
				);
				err.status = response.status;
				err.response = response;
				err.data = data;
				return Promise.reject(err);
			}

			return data;
		} catch (err) {
			const error = err as Error & { status?: number; response?: Response; data?: unknown };
			if (error.name === "AbortError") {
				const abortErr = new Error(`Request aborted: ${method.toUpperCase()} ${url}`);
				abortErr.name = "AbortError";
				throw abortErr;
			}
			console.error(
				`[API-CLIENT] Request failed: ${method.toUpperCase()} ${url} - ${error.message}`,
			);
			return Promise.reject(err);
		} finally {
			if (timeoutId) clearTimeout(timeoutId);
			activeRequests.delete(requestKey);
		}
	})();

	if (preventDuplicate) activeRequests.set(requestKey, fetchPromise);

	return fetchPromise;
}

/**
 * Parses JSON when the response has a body; otherwise returns null.
 */
async function safeParseJson(response: Response): Promise<unknown> {
	try {
		const text = await response.text();
		if (!text?.trim()) return null;

		return JSON.parse(text);
	} catch (parseError) {
		console.warn(`[API-CLIENT] Failed to parse JSON response:`, parseError);
		return null;
	}
}

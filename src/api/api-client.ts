import { API_BASE_URL } from "@/config/configs";
import { API_ROUTES } from "@/config/constants";
import type { APIResponse } from "@/types/api";

export class ApiError extends Error {
	constructor(
		message: string,
		readonly status: number,
		readonly retryAfter: number | null = null,
	) {
		super(message);
		this.name = "ApiError";
	}
}

type Query = Record<string, string | number | undefined>;

interface RequestOptions {
	method?: "GET" | "POST" | "DELETE";
	body?: unknown;
	query?: Query;
}

function buildUrl(path: string, query: Query = {}): string {
	const params = new URLSearchParams();
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined) params.set(key, String(value));
	}

	const qs = params.toString();
	return `${API_BASE_URL.replace(/\/+$/, "")}/${path}${qs ? `?${qs}` : ""}`;
}

function send(path: string, { method = "GET", body, query }: RequestOptions): Promise<Response> {
	const isForm = body instanceof FormData;

	return fetch(buildUrl(path, query), {
		method,
		// The session lives in an HttpOnly cookie, so every request must send it.
		credentials: "include",
		// FormData sets its own multipart Content-Type (with the boundary).
		headers: body === undefined || isForm ? undefined : { "Content-Type": "application/json" },
		body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
	});
}

async function parseEnvelope<T>(response: Response): Promise<APIResponse<T> | null> {
	const text = await response.text();
	if (!text) return null;

	try {
		return JSON.parse(text) as APIResponse<T>;
	} catch {
		return null;
	}
}

function parseRetryAfter(header: string | null): number | null {
	if (header === null) return null;

	const seconds = Number(header);
	return Number.isFinite(seconds) ? seconds : null;
}

/**
 * Sends a request and returns the envelope's `data`. If the session cookie has
 * expired (401), it refreshes the session once and retries.
 */
export async function sendRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
	let response = await send(path, options);

	if (response.status === 401 && path !== API_ROUTES.AUTH_INIT) {
		await send(API_ROUTES.AUTH_INIT, { method: "POST" });
		response = await send(path, options);
	}

	const envelope = await parseEnvelope<T>(response);

	if (!response.ok) {
		throw new ApiError(
			envelope?.message || response.statusText || "Request failed",
			response.status,
			parseRetryAfter(response.headers.get("Retry-After")),
		);
	}

	return (envelope?.data ?? null) as T;
}

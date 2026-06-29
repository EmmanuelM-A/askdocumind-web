import type { APIResponse } from "@/types/api.ts";

/**
 * Check if the value passed is an object and if it is not null.
 */
export function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null;
}

/**
 * Checks if the value follows the structure of the API format.
 */
export function isAPIResponse(value: unknown): value is APIResponse {
	return (
		isRecord(value) &&
		typeof value.success === "boolean" &&
		typeof value.message === "string" &&
		typeof value.timestamp === "string"
	);
}

/**
 * Checks if the data has been returned
 */
export function extractAPIData<T>(raw: unknown, operation: string): T {
	if (!isAPIResponse(raw)) {
		throw new Error(`${operation} failed: malformed API response`);
	}

	const response = raw;
	if (response.error) {
		throw new Error(response.error.details || response.message || `${operation} failed`);
	}

	if (response.data === undefined || response.data === null) {
		throw new Error(`${operation} failed: missing or invalid data payload`);
	}

	return response.data as T;
}

/**
 * Extracts a user-friendly message from an API error response.
 * Falls back to the provided fallback string when no specific message is available.
 */
export function getApiErrorMessage(error: unknown, fallback: string): string {
	if (!error || typeof error !== "object") return fallback;
	const data = (error as Record<string, unknown>).data;
	if (!data || typeof data !== "object") return fallback;
	const rec = data as Record<string, unknown>;
	if (rec.error && typeof rec.error === "object") {
		const details = (rec.error as Record<string, unknown>).details;
		if (typeof details === "string" && details) return details;
	}
	if (typeof rec.message === "string" && rec.message) return rec.message;
	return fallback;
}

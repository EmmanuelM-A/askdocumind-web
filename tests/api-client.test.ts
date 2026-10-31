import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { ApiError, sendRequest } from "@/api/api-client";

const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
	fetchMock.mockReset();
	vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
	vi.unstubAllGlobals();
});

function jsonResponse(status: number, body: unknown, headers: Record<string, string> = {}) {
	return new Response(JSON.stringify(body), { status, headers });
}

function ok(data: unknown) {
	return jsonResponse(200, { success: true, message: "OK", timestamp: "", data });
}

function fail(status: number, headers: Record<string, string> = {}) {
	return jsonResponse(
		status,
		{ success: false, message: "Failed", timestamp: "", error: { code: "X", details: null } },
		headers,
	);
}

async function rejectionOf(promise: Promise<unknown>): Promise<ApiError> {
	try {
		await promise;
	} catch (error) {
		return error as ApiError;
	}
	throw new Error("Expected the request to fail");
}

function calledUrls() {
	return fetchMock.mock.calls.map(([url]) => url);
}

describe("requests", () => {
	test("returns the envelope's data", async () => {
		fetchMock.mockResolvedValueOnce(ok({ id: "1" }));

		await expect(sendRequest("v1/thing")).resolves.toEqual({ id: "1" });
	});

	test("adds only the defined query params to the URL", async () => {
		fetchMock.mockResolvedValueOnce(ok(null));

		await sendRequest("v1/thing", { query: { page: 2, limit: undefined } });

		expect(calledUrls()).toEqual(["/v1/thing?page=2"]);
	});

	test("sends JSON bodies as JSON, with cookies", async () => {
		fetchMock.mockResolvedValueOnce(ok(null));

		await sendRequest("v1/thing", { method: "POST", body: { a: 1 } });

		expect(fetchMock.mock.calls[0][1]).toMatchObject({
			method: "POST",
			credentials: "include",
			headers: { "Content-Type": "application/json" },
			body: '{"a":1}',
		});
	});

	test("sends FormData as-is, letting the browser set the content type", async () => {
		fetchMock.mockResolvedValueOnce(ok(null));
		const form = new FormData();

		await sendRequest("v1/thing", { method: "POST", body: form });

		const init = fetchMock.mock.calls[0][1];
		expect(init?.body).toBe(form);
		expect(init?.headers).toBeUndefined();
	});

	test("returns null for an empty 204 response", async () => {
		fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }));

		await expect(sendRequest("v1/thing", { method: "DELETE" })).resolves.toBeNull();
	});
});

describe("expired sessions", () => {
	test("refreshes the session on a 401 and retries once", async () => {
		fetchMock
			.mockResolvedValueOnce(fail(401))
			.mockResolvedValueOnce(ok(null))
			.mockResolvedValueOnce(ok({ id: "1" }));

		await expect(sendRequest("v1/thing")).resolves.toEqual({ id: "1" });
		expect(calledUrls()).toEqual(["/v1/thing", "/v1/auth/anonymous/init", "/v1/thing"]);
	});

	test("gives up when the retry is also a 401", async () => {
		fetchMock
			.mockResolvedValueOnce(fail(401))
			.mockResolvedValueOnce(ok(null))
			.mockResolvedValueOnce(fail(401));

		const error = await rejectionOf(sendRequest("v1/thing"));

		expect(error.status).toBe(401);
		expect(fetchMock).toHaveBeenCalledTimes(3);
	});

	test("never retries the session init call itself", async () => {
		fetchMock.mockResolvedValueOnce(fail(401));

		const error = await rejectionOf(sendRequest("v1/auth/anonymous/init", { method: "POST" }));

		expect(error.status).toBe(401);
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});
});

describe("errors", () => {
	test("throws an ApiError with the status and the Retry-After seconds", async () => {
		fetchMock.mockResolvedValueOnce(fail(429, { "Retry-After": "7" }));

		const error = await rejectionOf(sendRequest("v1/thing"));

		expect(error).toBeInstanceOf(ApiError);
		expect(error.status).toBe(429);
		expect(error.retryAfter).toBe(7);
	});

	test("leaves retryAfter empty when there's no Retry-After header", async () => {
		fetchMock.mockResolvedValueOnce(fail(503));

		const error = await rejectionOf(sendRequest("v1/thing"));

		expect(error.status).toBe(503);
		expect(error.retryAfter).toBeNull();
	});

	test("still throws an ApiError when the error body isn't JSON", async () => {
		fetchMock.mockResolvedValueOnce(new Response("<html lang='en'>Bad gateway</html>", { status: 502 }));

		const error = await rejectionOf(sendRequest("v1/thing"));

		expect(error).toBeInstanceOf(ApiError);
		expect(error.status).toBe(502);
	});
});

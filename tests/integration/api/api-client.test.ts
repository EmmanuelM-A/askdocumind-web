/** biome-ignore-all lint/suspicious/noExplicitAny: For testing purposes */
import { beforeEach, describe, expect, test, vi } from "vitest";
import {sendRequest} from "@/api/api-client.ts";

const describeIfDevelopment = process.env.NODE_ENV === "development" ? describe : describe.skip;

describeIfDevelopment("sendRequest Integration Tests with httpbin.org", () => {
    const HTTP_BIN_BASE = "https://httpbin.org";

    beforeEach(() => {
        // Clear any existing requests between tests
        if (typeof window !== "undefined" && (window as any).__pwmActiveRequests) {
            (window as any).__pwmActiveRequests.clear();
        }
    });

    test("1. Basic GET request", async () => {
        const response = await sendRequest({
            route: HTTP_BIN_BASE,
            endpoint: "get",
            method: "GET",
        });

        expect(response).toBeDefined();
        expect(typeof response).toBe("object");
        expect((response as any).url).toContain("https://httpbin.org/get");
    });

    test("2. GET with query parameters", async () => {
        const response = await sendRequest({
            route: HTTP_BIN_BASE,
            endpoint: "get",
            method: "GET",
            query: { key1: "value1", key2: "value2" },
        });

        expect(response).toBeDefined();
        expect((response as any).args).toBeDefined();
        expect((response as any).args.key1).toBe("value1");
        expect((response as any).args.key2).toBe("value2");
    });

    test("3. POST request with JSON body", async () => {
        const body = { name: "test", value: 123 };

        const response = await sendRequest({
            route: HTTP_BIN_BASE,
            endpoint: "post",
            method: "POST",
            body,
        });

        expect(response).toBeDefined();
        expect((response as any).json).toEqual(body);
    });

    test("4. Duplicate request prevention", async () => {
        const requestParams = {
            route: HTTP_BIN_BASE,
            endpoint: "get",
            method: "GET" as const,
        };

        // Start two identical requests simultaneously
        const [response1, response2] = await Promise.all([
            sendRequest(requestParams),
            sendRequest(requestParams),
        ]);

        // Both should succeed and have same structure
        expect(response1).toBeDefined();
        expect(response2).toBeDefined();
        expect((response1 as any).url).toBe((response2 as any).url);
    });

    test("5. Request with custom headers", async () => {
        const response = await sendRequest({
            route: HTTP_BIN_BASE,
            endpoint: "get",
            method: "GET",
            headers: {
                "X-Custom-Header": "test-value",
            },
        });

        expect(response).toBeDefined();
        expect((response as any).headers).toBeDefined();
        expect((response as any).headers["X-Custom-Header"]).toBe("test-value");
    });

    test("6. Request timeout handling", async () => {
        try {
            await sendRequest({
                route: HTTP_BIN_BASE,
                endpoint: "delay/10", // 10-second delay
                method: "GET",
                options: {
                    timeoutMs: 100, // 100ms timeout - should fail
                },
            });
            expect.fail("Should have timed out");
        } catch (error) {
            expect(error).toBeDefined();
            expect((error as Error).name).toBe("AbortError");
        }
    }, 15000);

    test("7. Request cancellation with AbortSignal", async () => {
        const controller = new AbortController();

        // Cancel the request after 50ms
        setTimeout(() => controller.abort(), 50);

        try {
            await sendRequest({
                route: HTTP_BIN_BASE,
                endpoint: "delay/5", // 5-second delay
                method: "GET",
                options: {
                    signal: controller.signal,
                },
            });
            expect.fail("Should have been aborted");
        } catch (error) {
            expect(error).toBeDefined();
            expect((error as Error).name).toBe("AbortError");
        }
    }, 10000);

    test("8. Error handling for non-existent endpoint", async () => {
        try {
            await sendRequest({
                route: HTTP_BIN_BASE,
                endpoint: "status/404",
                method: "GET",
            });
            expect.fail("Should have thrown an error");
        } catch (error) {
            expect(error).toBeDefined();
            expect((error as any).status).toBe(404);
        }
    });

    test("9. Custom request key override", async () => {
        const customKey = "my-custom-request-key";

        const response = await sendRequest({
            route: HTTP_BIN_BASE,
            endpoint: "get",
            method: "GET",
            options: {
                requestKeyOverride: customKey,
                preventDuplicate: true,
            },
        });

        expect(response).toBeDefined();
        expect((response as any).url).toContain("https://httpbin.org/get");
    });

    test("10. PUT request with body", async () => {
        const body = { updated: true, id: 1 };

        const response = await sendRequest({
            route: HTTP_BIN_BASE,
            endpoint: "put",
            method: "PUT",
            body,
        });

        expect(response).toBeDefined();
        expect((response as any).json).toEqual(body);
    });

    test("11. DELETE request", async () => {
        const response = await sendRequest({
            route: HTTP_BIN_BASE,
            endpoint: "delete",
            method: "DELETE",
        });

        expect(response).toBeDefined();
        expect((response as any).url).toContain("https://httpbin.org/delete");
    });

    test("12. PATCH request with body", async () => {
        const body = { patched: true };

        const response = await sendRequest({
            route: HTTP_BIN_BASE,
            endpoint: "patch",
            method: "PATCH",
            body,
        });

        expect(response).toBeDefined();
        expect((response as any).json).toEqual(body);
    });

    test("13. HTTP status code error - server error", async () => {
        try {
            await sendRequest({
                route: HTTP_BIN_BASE,
                endpoint: "status/500",
                method: "GET",
            });
            expect.fail("Should have thrown an error");
        } catch (error) {
            expect(error).toBeDefined();
            expect((error as any).status).toBe(500);
        }
    });

    test("14. Multiple headers with version", async () => {
        const originalFetch = globalThis.fetch;
        const fetchMock = vi.fn().mockResolvedValue(
            new Response(JSON.stringify({ ok: true }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }),
        );

        vi.stubGlobal("fetch", fetchMock as typeof fetch);

        try {
            await sendRequest({
                route: HTTP_BIN_BASE,
                endpoint: "get",
                method: "GET",
                headers: {
                    "X-Request-ID": "test-123",
                    "X-Version": "1.0",
                },
            });

            expect(fetchMock).toHaveBeenCalledTimes(1);

            const [, requestInit] = fetchMock.mock.calls[0] as [string, RequestInit];
            const sentHeaders = requestInit.headers as Record<string, string>;

            expect(sentHeaders["X-Request-ID"]).toBe("test-123");
            expect(sentHeaders["X-Version"]).toBe("1.0");
            expect(sentHeaders["Accept-Version"]).toBeDefined();
        } finally {
            vi.stubGlobal("fetch", originalFetch as typeof fetch);
        }
    });
});

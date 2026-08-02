import { afterEach, beforeEach, expect, test, vi } from "vitest";

const originalEnv = process.env.NEXT_PUBLIC_ENV;

beforeEach(() => {
	vi.resetModules();
});

afterEach(() => {
	process.env.NEXT_PUBLIC_ENV = originalEnv;
});

test("debug-level logs are enabled in development", async () => {
	process.env.NEXT_PUBLIC_ENV = "development";

	const { logger } = await import("@/lib/logger");

	expect(logger.level).toBe("debug");
	expect(logger.isLevelEnabled("debug")).toBe(true);
});

test("debug-level logs are disabled (silent) in production", async () => {
	process.env.NEXT_PUBLIC_ENV = "production";

	const { logger } = await import("@/lib/logger");

	expect(logger.level).toBe("warn");
	expect(logger.isLevelEnabled("debug")).toBe(false);
});

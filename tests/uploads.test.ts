import { describe, expect, test } from "vitest";
import { ACCEPTED_EXTENSIONS, getUploadError, withUploadMimeType } from "@/lib/uploads";

function makeFile(name: string, size = 10, type = ""): File {
	const file = new File(["x"], name, { type });
	Object.defineProperty(file, "size", { value: size });
	return file;
}

describe("getUploadError", () => {
	test.each(ACCEPTED_EXTENSIONS)("accepts %s files", (extension) => {
		expect(getUploadError(makeFile(`file${extension}`), [])).toBeNull();
	});

	test("ignores the case of the extension", () => {
		expect(getUploadError(makeFile("REPORT.PDF"), [])).toBeNull();
	});

	test.each(["data.csv", "image.png", "no-extension"])("rejects %s", (name) => {
		expect(getUploadError(makeFile(name), [])).not.toBeNull();
	});

	test("rejects empty files", () => {
		expect(getUploadError(makeFile("a.txt", 0), [])).not.toBeNull();
	});

	test("accepts a file of exactly 10 MB and rejects anything bigger", () => {
		expect(getUploadError(makeFile("a.txt", 10 * 1024 * 1024), [])).toBeNull();
		expect(getUploadError(makeFile("a.txt", 10 * 1024 * 1024 + 1), [])).not.toBeNull();
	});

	test("rejects a name that's already in the chat", () => {
		expect(getUploadError(makeFile("a.txt"), ["a.txt"])).not.toBeNull();
	});

	test("rejects files once the chat has 10 documents", () => {
		const nine = Array.from({ length: 9 }, (_, i) => `${i}.txt`);

		expect(getUploadError(makeFile("a.txt"), nine)).toBeNull();
		expect(getUploadError(makeFile("a.txt"), [...nine, "9.txt"])).not.toBeNull();
	});
});

describe("withUploadMimeType", () => {
	test.each([
		["app.ts", "video/mp2t", "text/plain"],
		["main.go", "", "text/plain"],
		["view.tsx", "", "text/plain"],
		["script.py", "", "text/x-python"],
		["REPORT.PDF", "", "application/pdf"],
	])("sends %s (browser type %j) as %s", (name, browserType, expected) => {
		expect(withUploadMimeType(new File(["x"], name, { type: browserType })).type).toBe(
			expected,
		);
	});

	test("keeps the file's name and contents", () => {
		const file = withUploadMimeType(new File(["hello"], "notes.md"));

		expect(file.name).toBe("notes.md");
		expect(file.size).toBe(5);
	});
});

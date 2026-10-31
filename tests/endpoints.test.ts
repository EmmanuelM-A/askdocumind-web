import { beforeEach, expect, test, vi } from "vitest";
import { sendRequest } from "@/api/api-client";
import { initAnonymousSession } from "@/api/auth-endpoints";
import { deleteChatSession, initChatSession } from "@/api/chat-session-endpoints";
import { askChatbot } from "@/api/chatbot-endpoints";
import {
	deleteAllDocuments,
	deleteDocument,
	getDocumentStatus,
	listDocuments,
	reprocessDocument,
	uploadDocument,
} from "@/api/document-endpoints";
import type { UUID } from "@/types/api";

vi.mock("@/api/api-client", () => ({ sendRequest: vi.fn() }));

const sendRequestMock = vi.mocked(sendRequest);

const CHAT = "11111111-1111-1111-1111-111111111111" as UUID;
const DOC = "22222222-2222-2222-2222-222222222222" as UUID;

beforeEach(() => {
	sendRequestMock.mockReset();
	sendRequestMock.mockResolvedValue({});
});

test.each([
	{
		name: "initAnonymousSession",
		call: () => initAnonymousSession(),
		args: ["v1/auth/anonymous/init", { method: "POST" }],
	},
	{
		name: "initChatSession",
		call: () => initChatSession({ title: "Demo" }),
		args: ["v1/chat-session/init", { method: "POST", body: { title: "Demo" } }],
	},
	{
		name: "deleteChatSession",
		call: () => deleteChatSession(CHAT),
		args: [`v1/chat-session/${CHAT}`, { method: "DELETE" }],
	},
	{
		name: "uploadDocument",
		call: () => uploadDocument(CHAT, new File(["hi"], "a.txt")),
		args: [`v1/uploads/${CHAT}`, { method: "POST", body: expect.any(FormData) }],
	},
	{
		name: "listDocuments",
		call: () => listDocuments(CHAT, 2, 5),
		args: [`v1/uploads/${CHAT}`, { query: { page: 2, limit: 5 } }],
	},
	{
		name: "getDocumentStatus",
		call: () => getDocumentStatus(CHAT, DOC),
		args: [`v1/uploads/${CHAT}/${DOC}/status`],
	},
	{
		name: "reprocessDocument",
		call: () => reprocessDocument(CHAT, DOC),
		args: [`v1/uploads/${CHAT}/${DOC}/reprocess`, { method: "POST" }],
	},
	{
		name: "deleteDocument",
		call: () => deleteDocument(CHAT, DOC),
		args: [`v1/uploads/${CHAT}/${DOC}`, { method: "DELETE" }],
	},
	{
		name: "deleteAllDocuments",
		call: () => deleteAllDocuments(CHAT),
		args: [`v1/uploads/${CHAT}`, { method: "DELETE" }],
	},
	{
		name: "askChatbot",
		call: () => askChatbot(CHAT, { query: "Hi?" }),
		args: [`v1/chatbot/${CHAT}/ask`, { method: "POST", body: { query: "Hi?" } }],
	},
])("$name calls the right route", async ({ call, args }) => {
	await call();

	expect(sendRequestMock).toHaveBeenCalledWith(...args);
});

test("uploadDocument sends the file in the `file` field", async () => {
	const file = new File(["hi"], "a.txt");

	await uploadDocument(CHAT, file);

	const body = sendRequestMock.mock.calls[0][1]?.body as FormData;
	expect((body.get("file") as File).name).toBe("a.txt");
});

test("getDocumentStatus and deleteAllDocuments unwrap their payloads", async () => {
	sendRequestMock.mockResolvedValueOnce({ status: "COMPLETED" });
	sendRequestMock.mockResolvedValueOnce({ deletedCount: 3 });

	await expect(getDocumentStatus(CHAT, DOC)).resolves.toBe("COMPLETED");
	await expect(deleteAllDocuments(CHAT)).resolves.toBe(3);
});

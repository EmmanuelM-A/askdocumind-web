import { beforeEach, expect, test } from "vitest";
import { type ChatMessage, loadChatHistory, saveChatHistory } from "@/lib/chat-history";

const messages: ChatMessage[] = [
	{ id: "1", role: "user", content: "How many days of leave?", sources: [] },
	{ id: "2", role: "assistant", content: "25 days.", sources: ["northwind-handbook.pdf"] },
];

beforeEach(() => {
	localStorage.clear();
});

test("returns the saved messages for the same chat", () => {
	saveChatHistory("chat-a", messages);

	expect(loadChatHistory("chat-a")).toEqual(messages);
});

test("ignores history saved for a different chat", () => {
	saveChatHistory("chat-a", messages);

	expect(loadChatHistory("chat-b")).toEqual([]);
});

test("a new chat's history replaces the old one", () => {
	saveChatHistory("chat-a", messages);
	saveChatHistory("chat-b", []);

	expect(loadChatHistory("chat-a")).toEqual([]);
});

test("returns nothing when there is no history or it is corrupted", () => {
	expect(loadChatHistory("chat-a")).toEqual([]);

	localStorage.setItem("askdocumind-chat-history", "{not json");
	expect(loadChatHistory("chat-a")).toEqual([]);
});

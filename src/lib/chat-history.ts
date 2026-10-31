export interface ChatMessage {
	id: string;
	role: "user" | "assistant";
	content: string;
	sources: string[];
}

// The API doesn't save messages yet, so the conversation is kept in the
// browser. Only the current chat is stored; a new chat replaces it.
const STORAGE_KEY = "askdocumind-chat-history";

export function loadChatHistory(chatId: string): ChatMessage[] {
	try {
		const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
		return stored?.chatId === chatId && Array.isArray(stored.messages) ? stored.messages : [];
	} catch {
		return [];
	}
}

export function saveChatHistory(chatId: string, messages: ChatMessage[]): void {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify({ chatId, messages }));
	} catch {
		// Storage can be full or disabled; the chat still works without it.
	}
}

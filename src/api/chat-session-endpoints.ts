import { sendRequest } from "@/api/api-client";
import { API_ROUTES } from "@/config/constants";
import type { UUID } from "@/types/api";
import type { ChatSession, CreateChatSession } from "@/types/chat-sessions";

// Returns the user's most recent chat, creating one only if they have none.
export function initChatSession(data: CreateChatSession): Promise<ChatSession> {
	return sendRequest<ChatSession>(`${API_ROUTES.CHAT_SESSIONS}/init`, {
		method: "POST",
		body: data,
	});
}

// Deletes the chat along with all of its files and messages.
export async function deleteChatSession(chatSessionId: UUID): Promise<void> {
	await sendRequest(`${API_ROUTES.CHAT_SESSIONS}/${chatSessionId}`, { method: "DELETE" });
}

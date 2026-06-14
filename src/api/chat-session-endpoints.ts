import { sendRequest } from "@/api/api-client.ts";
import { extractAPIData } from "@/api/utils.ts";
import { API_ROUTES } from "@/config/constants.ts";
import type { UUID } from "@/types/api.ts";
import type { ChatMessage } from "@/types/chat-messages.ts";
import type { CreateChatSession } from "@/types/chat-sessions.ts";

export async function deleteChatSession(chatSessionId: UUID): Promise<UUID> {
	const rawResponse = await sendRequest({
		route: API_ROUTES.CHAT_SESSIONS,
		endpoint: chatSessionId,
	});

	const { chat_id } = extractAPIData<{ chat_id: UUID }>(rawResponse, "Delete chat session");

	return chat_id;
}

export async function getChatSessionMessages(chatSessionId: UUID): Promise<Array<ChatMessage>> {
	const rawResponse = await sendRequest({
		route: API_ROUTES.CHAT_SESSIONS,
		method: "GET",
		endpoint: `/${chatSessionId}/messages`,
	});

	return extractAPIData<Array<ChatMessage>>(rawResponse, "Get chat messages");
}

export async function initChatSession(data: CreateChatSession): Promise<{ chat_id: UUID }> {
	const rawResponse = await sendRequest({
		route: API_ROUTES.CHAT_SESSIONS,
		endpoint: "init",
		method: "POST",
		body: data,
	});

	return extractAPIData(rawResponse, "Initialize chat session");
}

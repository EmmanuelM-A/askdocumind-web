import { sendRequest } from "@/api/api-client";
import { extractAPIData } from "@/api/utils";
import { API_ROUTES } from "@/config/constants";
import type { UUID } from "@/types/api";
import type { ChatMessage } from "@/types/chat-messages";
import type { CreateChatSession } from "@/types/chat-sessions";

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

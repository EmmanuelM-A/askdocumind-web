import {sendRequest} from "@/api/api-client.ts";
import {API_ENDPOINTS} from "@/config/constants.ts";
import {UUID} from "@/types/api.ts";
import {
    ChatSession,
    CreateChatSession,
    CreatedChatSession,
    UpdateChatSession
} from "@/types/chat-sessions.ts";
import {extractAPIData} from "@/api/utils.ts";
import {ChatMessage} from "@/types/chat-messages.ts";


export async function createChatSession(data: CreateChatSession): Promise<CreatedChatSession>  {
    const rawResponse = await sendRequest({
        endpoint: API_ENDPOINTS.CHAT_SESSIONS,
        method: "POST",
        body: data,
    });

    return extractAPIData(rawResponse, "Create chat session");
}

export async function getChatSession(chatSessionId: UUID): Promise<ChatSession> {
    const rawResponse = await sendRequest({
        endpoint: `${API_ENDPOINTS.CHAT_SESSIONS}${chatSessionId}`,
        method: "GET",
    });

    return extractAPIData<ChatSession>(rawResponse, "Get chat session");
}

export async function updateChatSession(chatSessionId: UUID, data: UpdateChatSession): Promise<ChatSession> {
    const rawResponse = await sendRequest({
        endpoint: `${API_ENDPOINTS.CHAT_SESSIONS}${chatSessionId}`,
        method: "PATCH",
        body: data,
    });

    return extractAPIData<ChatSession>(rawResponse, "Update chat session");
}

export async function deleteChatSession(chatSessionId: UUID): Promise<UUID> {
    const rawResponse = await sendRequest({
        endpoint: `${API_ENDPOINTS.CHAT_SESSIONS}${chatSessionId}`
    });

    const { chat_id } = extractAPIData<{ chat_id: UUID }>(rawResponse, "Delete chat session");

    return chat_id;
}

export async function getChatSessionMessages(chatSessionId: UUID): Promise<Array<ChatMessage>> {
    const rawResponse = await sendRequest({
        endpoint: API_ENDPOINTS.CHAT_SESSIONS,
        method: "GET",
        route: `${chatSessionId}/messages`,
    });

    return extractAPIData<Array<ChatMessage>>(rawResponse, "Get chat messages");
}

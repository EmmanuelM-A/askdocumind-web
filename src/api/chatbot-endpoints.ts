import { sendRequest } from "@/api/api-client";
import { API_ROUTES } from "@/config/constants";
import type { UUID } from "@/types/api";
import type { AskRequest, AskResponse } from "@/types/chatbot";

export function askChatbot(chatSessionId: UUID, request: AskRequest): Promise<AskResponse> {
	return sendRequest<AskResponse>(`${API_ROUTES.CHATBOT}/${chatSessionId}/ask`, {
		method: "POST",
		body: request,
	});
}

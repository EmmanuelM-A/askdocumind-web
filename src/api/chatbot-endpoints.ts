import { sendRequest } from "@/api/api-client.ts";
import { extractAPIData } from "@/api/utils.ts";
import { API_ROUTES } from "@/config/constants.ts";
import type { ChatbotResponse, ChatWithChatbot } from "@/types/chatbot.ts";

export async function chatWithChatbot(data: ChatWithChatbot): Promise<ChatbotResponse> {
	const rawResponse = await sendRequest({
		route: API_ROUTES.CHATBOT,
		method: "POST",
		body: data,
		endpoint: "/",
	});

	return extractAPIData<ChatbotResponse>(rawResponse, "Create chat session");
}

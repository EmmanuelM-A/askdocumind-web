import { sendRequest } from "@/api/api-client.ts";
import { extractAPIData } from "@/api/utils.ts";
import { API_ROUTES } from "@/config/constants.ts";
import { logger } from "@/lib/logger.ts";
import type { ChatbotResponse, ChatWithChatbot } from "@/types/chatbot.ts";

export async function chatWithChatbot(data: ChatWithChatbot): Promise<ChatbotResponse> {
	const rawResponse = await sendRequest({
		route: API_ROUTES.CHATBOT,
		method: "POST",
		body: data,
	});

	logger.log("[chatbot] raw response:", rawResponse);

	return extractAPIData<ChatbotResponse>(rawResponse, "Create chat session");
}

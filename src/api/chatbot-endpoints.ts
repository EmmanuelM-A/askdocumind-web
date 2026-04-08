import {sendRequest} from "@/api/api-client.ts";
import {API_ENDPOINTS} from "@/config/constants.ts";
import {extractAPIData} from "@/api/utils.ts";
import {ChatbotResponse, ChatWithChatbot} from "@/types/chatbot.ts";

export async function chatWithChatbot(data: ChatWithChatbot): Promise<ChatbotResponse>  {
    const rawResponse = await sendRequest({
        endpoint: API_ENDPOINTS.CHATBOT,
        method: "POST",
        body: data,
    });

    return extractAPIData<ChatbotResponse>(rawResponse, "Create chat session");
}
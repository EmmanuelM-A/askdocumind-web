export interface ChatWithChatbot {
	user_query: string;
	chat_id: string;
	web_search_enabled: boolean;
}

export interface ChatbotResponse {
	answer: string;
	sources: string[];
}

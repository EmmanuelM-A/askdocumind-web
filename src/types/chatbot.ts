
export interface ChatWithChatbot {
    userQuery: string;
    chatSessionId: string;
    isWebSearchEnabled: boolean;
}

export interface ChatbotResponse {
    answer: string;
    sources: string[];
    sourceType: string;
}
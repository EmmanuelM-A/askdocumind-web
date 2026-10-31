export interface AskConfigs {
	topK?: number;
	threshold?: number;
	webSearchEnabled?: boolean;
}

export interface AskRequest {
	query: string;
	configs?: AskConfigs;
}

export interface AskResponse {
	answer: string;
	sources: string[];
}

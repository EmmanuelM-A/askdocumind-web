import type { UUID } from "@/types/api";

export interface ChatSession {
	id: UUID;
	title: string;
	createdAt: string;
}

export interface CreateChatSession {
	title: string;
}

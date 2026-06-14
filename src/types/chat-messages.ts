import type { UUID } from "@/types/api.ts";

export interface ChatMessage {
	id: UUID;
	sessionId: string;
	role: "USER" | "ASSISTANT" | "SYSTEM";
	content: string;
	createdAt: string;
}

import type { UUID } from "@/types/api.ts";

export interface ChatMessage {
	id: UUID;
	session_id: UUID;
	role: "USER" | "ASSISTANT" | "SYSTEM";
	content: string;
	sources: string[] | null;
	created_at: string;
}

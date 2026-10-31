import type { UUID } from "@/types/api";

export type DocumentStatus = "PENDING" | "UPLOADED" | "PROCESSING" | "COMPLETED" | "FAILED";

export interface Document {
	id: UUID;
	chatSessionId: UUID;
	filename: string;
	contentType: string;
	sizeBytes: number;
	checksum: string;
	status: DocumentStatus;
	errorMessage: string | null;
	createdAt: string;
	updatedAt: string;
}

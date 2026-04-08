import {UUID} from "@/types/api.ts";


export interface Document {
    id: UUID;
    chatSessionId: UUID;
    filename: string;
    fileSize: number;
    vectorId: UUID;
    processingStatus: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
    createdAt: string;
    updatedAt: string;
}
import {UUID} from "@/types/api.ts";


export interface Document {
    id: UUID;
    chatSessionId: UUID;
    filename: string;
    fileSize: number;
    vectorId: UUID;
    processingStatus: "PROCESSING" | "COMPLETED" | "FAILED";
    createdAt: string;
    updatedAt: string;
}

export type ProcessingStatus = Document["processingStatus"];

export interface StatusColours {
    textColour: string;
    backgroundColour: string;
}

export interface StatusThemeColours {
    light: StatusColours;
    dark: StatusColours;
}

export type ProcessingStatusColoursMap = Record<ProcessingStatus, StatusThemeColours>;

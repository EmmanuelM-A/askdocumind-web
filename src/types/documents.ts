import {UUID} from "@/types/api.ts";


export interface Document {
    id: UUID;
    session_id: UUID;
    filename: string;
    file_size: number;
    vector_id: UUID;
    processing_status: "PROCESSING" | "COMPLETED" | "FAILED";
    created_at: string;
    updated_at: string;
}

export type ProcessingStatus = Document["processing_status"];

export interface StatusColours {
    textColour: string;
    backgroundColour: string;
}

export interface StatusThemeColours {
    light: StatusColours;
    dark: StatusColours;
}

export type ProcessingStatusColoursMap = Record<ProcessingStatus, StatusThemeColours>;

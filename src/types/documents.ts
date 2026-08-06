import type { UUID } from "@/types/api";

export interface Document {
	id: UUID;
	session_id: UUID;
	source: string;
	source_size: number;
	source_type: "UPLOAD" | "WEB_SEARCH";
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

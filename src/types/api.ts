export interface ErrorData {
	code: string;
	details: string;
	stackTrace?: string;
}

export interface APIResponse {
	success: boolean;
	message: string;
	timestamp: string;
	data?: unknown;
	error?: ErrorData;
}

export interface HealthDataFormat {
	status: string;
}

/**
 * UUID as defined from node:crypto, but represented as a string for easier use across the codebase.
 */
export type UUID = `${string}-${string}-${string}-${string}-${string}`;

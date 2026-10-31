export type UUID = `${string}-${string}-${string}-${string}-${string}`;

export interface APIResponse<T = unknown> {
	success: boolean;
	message: string;
	timestamp: string;
	data?: T | null;
	error?: {
		code: string;
		details: Record<string, string> | null;
		stackTrace?: string | null;
	};
}

export interface Page<T> {
	items: T[];
	total: number;
	page: number;
	size: number;
	pages: number;
}

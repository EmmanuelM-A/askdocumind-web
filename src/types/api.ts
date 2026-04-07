


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

import {sendRequest} from "@/api/api-client.ts";
import {API_ENDPOINTS} from "@/config/constants.ts";
import {APIResponse, HealthDataFormat} from "@/types/api.ts";


export async function isApiConnectionHealthy(): Promise<boolean> {
    const response = await sendRequest({
        endpoint: API_ENDPOINTS.API_HEALTH,
        method: "GET"
    }) as APIResponse;

    if (!response.data) throw Error("Failed to fetch health response");

    return (response.data as HealthDataFormat).status === "OK";
}

export async function isDatabaseConnectionHealthy(): Promise<boolean> {
    const response = await sendRequest({
        endpoint: API_ENDPOINTS.DB_HEALTH,
        method: "GET"
    }) as APIResponse;

    if (!response.data) throw Error("Failed to fetch database connection");

    return (response.data as HealthDataFormat).status === "OK";
}
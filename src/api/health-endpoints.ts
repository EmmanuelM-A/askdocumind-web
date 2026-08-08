import { sendRequest } from "@/api/api-client";
import { API_ROUTES } from "@/config/constants";
import type { APIResponse, HealthDataFormat } from "@/types/api";

export async function isApiConnectionHealthy(): Promise<boolean> {
	const response = (await sendRequest({
		route: API_ROUTES.HEALTH,
		endpoint: "api",
		method: "GET",
	})) as APIResponse;

	if (!response.data) throw Error("Failed to fetch health response");

	return (response.data as HealthDataFormat).status === "OK";
}

export async function isDatabaseConnectionHealthy(): Promise<boolean> {
	const response = (await sendRequest({
		route: API_ROUTES.HEALTH,
		endpoint: "db",
		method: "GET",
	})) as APIResponse;

	if (!response.data) throw Error("Failed to fetch database connection");

	return (response.data as HealthDataFormat).status === "OK";
}

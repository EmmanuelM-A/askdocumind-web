import { sendRequest } from "@/api/api-client";
import { API_ROUTES } from "@/config/constants";

// Sets (or refreshes) the anonymous session cookie.
export async function initAnonymousSession(): Promise<void> {
	await sendRequest(API_ROUTES.AUTH_INIT, { method: "POST" });
}

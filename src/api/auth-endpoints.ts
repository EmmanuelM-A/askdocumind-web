import { sendRequest } from "@/api/api-client";
import { extractAPIData } from "@/api/utils";
import { API_ROUTES } from "@/config/constants";
import type { UUID } from "@/types/api";

export async function createAnonymousUserSession(): Promise<UUID> {
	const rawResponse = await sendRequest({
		route: API_ROUTES.ANONYMOUS_AUTH,
		method: "POST",
	});

	const { user_id } = extractAPIData<{ user_id: UUID }>(
		rawResponse,
		"Create anonymous user session",
	);

	return user_id;
}

import {sendRequest} from "@/api/api-client.ts";
import {API_ENDPOINTS} from "@/config/constants.ts";
import {extractAPIData} from "@/api/utils.ts";
import {UUID} from "node:crypto";


export async function createAnonymousUserSession(): Promise<UUID>  {
    const rawResponse = await sendRequest({
        endpoint: API_ENDPOINTS.ANONYMOUS_AUTH,
        method: "POST",
    });

    const { user_id } = extractAPIData<{ user_id: UUID }>(rawResponse, "Create anonymous user session");

    return user_id;
}
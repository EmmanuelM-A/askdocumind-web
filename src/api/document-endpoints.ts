import { sendRequest } from "@/api/api-client.ts";
import { extractAPIData } from "@/api/utils.ts";
import { API_ROUTES } from "@/config/constants.ts";
import type { APIResponse, UUID } from "@/types/api.ts";
import type { Document } from "@/types/documents.ts";

interface UploadDocumentsParams {
	chatSessionId: UUID;
	documents: File[];
}

export async function uploadDocuments({
	chatSessionId,
	documents,
}: UploadDocumentsParams): Promise<APIResponse> {
	const multipart = new FormData();
	multipart.append("chat_id", chatSessionId);

	for (const file of documents) {
		multipart.append("documents", file);
	}

	// The upload endpoint's `data` is always null, so extractAPIData (which
	// requires non-null data) can't be used here - return the raw envelope.
	return (await sendRequest({
		route: API_ROUTES.DOCUMENTS,
		method: "POST",
		body: multipart,
	})) as APIResponse;
}

export async function getUploadedDocuments(chatSessionId: UUID): Promise<Array<Document>> {
	const rawResponse = await sendRequest({
		route: API_ROUTES.DOCUMENTS,
		method: "GET",
		query: {
			chat_id: chatSessionId,
		},
	});

	const { documents } = extractAPIData<{ documents: Array<Document> }>(
		rawResponse,
		"Get uploaded documents",
	);
	return documents;
}

export async function deleteUploadedDocument(documentId: UUID, chatSessionId: UUID): Promise<void> {
	await sendRequest({
		route: API_ROUTES.DOCUMENTS,
		method: "DELETE",
		endpoint: `${documentId}`,
		query: {
			chat_id: chatSessionId,
		},
	});
}

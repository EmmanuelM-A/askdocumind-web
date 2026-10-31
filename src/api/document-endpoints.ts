import { sendRequest } from "@/api/api-client";
import { API_ROUTES } from "@/config/constants";
import type { Page, UUID } from "@/types/api";
import type { Document, DocumentStatus } from "@/types/documents";

// Returns straight away (202). Processing carries on in the background, so
// poll getDocumentStatus until the status is COMPLETED or FAILED.
export function uploadDocument(chatSessionId: UUID, file: File): Promise<Document> {
	const body = new FormData();
	body.append("file", file);

	return sendRequest<Document>(`${API_ROUTES.UPLOADS}/${chatSessionId}`, {
		method: "POST",
		body,
	});
}

export function listDocuments(chatSessionId: UUID, page = 1, limit = 10): Promise<Page<Document>> {
	return sendRequest<Page<Document>>(`${API_ROUTES.UPLOADS}/${chatSessionId}`, {
		query: { page, limit },
	});
}

export async function getDocumentStatus(
	chatSessionId: UUID,
	documentId: UUID,
): Promise<DocumentStatus> {
	const { status } = await sendRequest<{ status: DocumentStatus }>(
		`${API_ROUTES.UPLOADS}/${chatSessionId}/${documentId}/status`,
	);
	return status;
}

// Only works on FAILED documents.
export function reprocessDocument(chatSessionId: UUID, documentId: UUID): Promise<Document> {
	return sendRequest<Document>(`${API_ROUTES.UPLOADS}/${chatSessionId}/${documentId}/reprocess`, {
		method: "POST",
	});
}

export async function deleteDocument(chatSessionId: UUID, documentId: UUID): Promise<void> {
	await sendRequest(`${API_ROUTES.UPLOADS}/${chatSessionId}/${documentId}`, { method: "DELETE" });
}

// Removes every file in the chat but keeps the chat itself.
export async function deleteAllDocuments(chatSessionId: UUID): Promise<number> {
	const { deletedCount } = await sendRequest<{ deletedCount: number }>(
		`${API_ROUTES.UPLOADS}/${chatSessionId}`,
		{ method: "DELETE" },
	);
	return deletedCount;
}

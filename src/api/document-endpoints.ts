import {sendRequest} from "@/api/api-client.ts";
import {API_ROUTES} from "@/config/constants.ts";
import {extractAPIData} from "@/api/utils.ts";
import {UUID} from "@/types/api.ts";
import {Document} from "@/types/documents.ts";

interface UploadDocumentsParams {
    chatSessionId: UUID;
    documents: File[];
}

export async function uploadDocuments({ chatSessionId, documents }: UploadDocumentsParams): Promise<number>  {
    const multipart = new FormData();
    multipart.append("chat_id", chatSessionId);

    for (const file of documents) {
        multipart.append("documents", file);
    }

    const rawResponse = await sendRequest({
        route: API_ROUTES.DOCUMENTS,
        method: "POST",
        body: multipart,
    });

    const { quantityUploaded } =  extractAPIData<{ quantityUploaded: number }>(rawResponse, "Uploaded documents");

    return quantityUploaded;
}

export async function getUploadedDocuments(chatSessionId: UUID): Promise<Array<Document>>  {
    const rawResponse = await sendRequest({
        route: API_ROUTES.DOCUMENTS,
        method: "GET",
        query: {
            chat_id: chatSessionId,
        }
    });

    return extractAPIData<Array<Document>>(rawResponse, "Get uploaded documents");
}

export async function deleteUploadedDocument(documentId: UUID, chatSessionId: UUID): Promise<void> {
    await sendRequest({
        route: API_ROUTES.DOCUMENTS,
        method: "DELETE",
        endpoint: `${documentId}`,
        query: {
            chat_id: chatSessionId,
        }
    });
}
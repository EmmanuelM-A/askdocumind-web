import {sendRequest} from "@/api/api-client.ts";
import {API_ENDPOINTS} from "@/config/constants.ts";
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
        endpoint: API_ENDPOINTS.DOCS_UPLOADS,
        method: "POST",
        body: multipart,
    });

    const { quantityUploaded } =  extractAPIData<{ quantityUploaded: number }>(rawResponse, "Uploaded documents");

    return quantityUploaded;
}

export async function getUploadedDocuments(chatSessionId: UUID): Promise<Array<Document>>  {
    const rawResponse = await sendRequest({
        endpoint: API_ENDPOINTS.DOCS_UPLOADS,
        method: "POST",
        route: `${chatSessionId}`
    });

    return extractAPIData<Array<Document>>(rawResponse, "Get uploaded documents");
}
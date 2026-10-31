import { useEffect, useRef, useState } from "react";
import { getErrorMessage, getRetryAfterSeconds, isChatGone } from "@/api/api-client";
import {
	deleteAllDocuments,
	deleteDocument,
	getDocumentStatus,
	listDocuments,
	reprocessDocument,
	uploadDocument,
} from "@/api/document-endpoints";
import { getUploadError, withUploadMimeType } from "@/lib/uploads";
import type { UUID } from "@/types/api";
import type { Document, DocumentStatus } from "@/types/documents";

export type RowStatus = DocumentStatus | "QUEUED" | "UPLOADING" | "REJECTED";

export interface DocumentRow {
	key: string;
	id: UUID | null;
	name: string;
	sizeBytes: number;
	status: RowStatus;
	message: string | null;
}

const POLL_INTERVAL_MS = 3000;

export function isProcessing(status: RowStatus): boolean {
	return status === "PENDING" || status === "UPLOADED" || status === "PROCESSING";
}

function toRow(document: Document): DocumentRow {
	return {
		key: document.id,
		id: document.id,
		name: document.filename,
		sizeBytes: document.sizeBytes,
		status: document.status,
		message: document.errorMessage,
	};
}

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export function useDocuments(chatId: UUID | null, onChatGone: () => void) {
	const [rows, setRows] = useState<DocumentRow[]>([]);
	// Files waiting to upload, by row key. Removing a key cancels that upload.
	const queuedFiles = useRef(new Map<string, File>());
	const uploadQueue = useRef(Promise.resolve());

	useEffect(() => {
		queuedFiles.current.clear();
		setRows([]);
		if (!chatId) return;

		let cancelled = false;
		listDocuments(chatId)
			.then(({ items }) => {
				if (!cancelled) setRows(items.map(toRow));
			})
			.catch((error) => console.error("Failed to load documents", error));

		return () => {
			cancelled = true;
		};
	}, [chatId]);

	const processingIds = rows
		.filter((row) => row.id && isProcessing(row.status))
		.map((row) => row.id)
		.join(",");

	useEffect(() => {
		if (!chatId || !processingIds) return;

		const timer = setInterval(async () => {
			let anyFailed = false;

			for (const id of processingIds.split(",") as UUID[]) {
				const status = await getDocumentStatus(chatId, id).catch(() => null);
				if (!status) continue;

				if (status === "FAILED") anyFailed = true;
				setRows((prev) => prev.map((row) => (row.id === id ? { ...row, status } : row)));
			}

			if (anyFailed) {
				const page = await listDocuments(chatId).catch(() => null);
				if (!page) return;

				setRows((prev) =>
					prev.map((row) => {
						const document = page.items.find((item) => item.id === row.id);
						return document && row.status === "FAILED"
							? { ...row, message: document.errorMessage }
							: row;
					}),
				);
			}
		}, POLL_INTERVAL_MS);

		return () => clearInterval(timer);
	}, [chatId, processingIds]);

	function updateRow(key: string, changes: Partial<DocumentRow>) {
		setRows((prev) => prev.map((row) => (row.key === key ? { ...row, ...changes } : row)));
	}

	async function upload(key: string): Promise<void> {
		const file = queuedFiles.current.get(key);
		if (!file || !chatId) return;

		updateRow(key, { status: "UPLOADING", message: null });

		try {
			const document = await uploadDocument(chatId, withUploadMimeType(file));
			queuedFiles.current.delete(key);
			updateRow(key, { id: document.id, status: document.status });
		} catch (error) {
			const retryAfter = getRetryAfterSeconds(error);
			if (retryAfter !== null) {
				updateRow(key, {
					status: "QUEUED",
					message: `Rate limited, retrying in ${retryAfter}s`,
				});
				await sleep(retryAfter * 1000);
				return upload(key);
			}

			queuedFiles.current.delete(key);
			if (isChatGone(error)) return onChatGone();
			updateRow(key, { status: "REJECTED", message: getErrorMessage(error) });
		}
	}

	function addFiles(files: File[]) {
		const names = rows.filter((row) => row.status !== "REJECTED").map((row) => row.name);

		const added = files.map((file): DocumentRow => {
			const key = crypto.randomUUID();
			const error = getUploadError(file, names);

			if (!error) {
				names.push(file.name);
				queuedFiles.current.set(key, file);
			}

			return {
				key,
				id: null,
				name: file.name,
				sizeBytes: file.size,
				status: error ? "REJECTED" : "QUEUED",
				message: error,
			};
		});

		setRows((prev) => [...prev, ...added]);

		for (const row of added) {
			if (row.status === "QUEUED") {
				uploadQueue.current = uploadQueue.current.then(() => upload(row.key));
			}
		}
	}

	function removeRow(row: DocumentRow) {
		queuedFiles.current.delete(row.key);
		setRows((prev) => prev.filter((item) => item.key !== row.key));

		if (row.id && chatId) {
			deleteDocument(chatId, row.id).catch((error) =>
				console.error("Failed to delete document", error),
			);
		}
	}

	async function retryRow(row: DocumentRow) {
		if (!row.id || !chatId) return;

		updateRow(row.key, { status: "PENDING", message: null });

		try {
			const document = await reprocessDocument(chatId, row.id);
			updateRow(row.key, { status: document.status });
		} catch (error) {
			updateRow(row.key, { status: "FAILED", message: getErrorMessage(error) });
		}
	}

	async function clearAll() {
		if (!chatId) return;

		queuedFiles.current.clear();
		setRows([]);

		try {
			await deleteAllDocuments(chatId);
		} catch (error) {
			console.error("Failed to clear documents", error);
			const page = await listDocuments(chatId).catch(() => null);
			if (page) setRows(page.items.map(toRow));
		}
	}

	return {
		rows,
		addFiles,
		removeRow,
		retryRow,
		clearAll,
		acceptedCount: rows.filter((row) => row.status !== "REJECTED").length,
		readyCount: rows.filter((row) => row.status === "COMPLETED").length,
		isUploading: rows.some((row) => row.status === "QUEUED" || row.status === "UPLOADING"),
		isProcessing: rows.some((row) => isProcessing(row.status)),
	};
}

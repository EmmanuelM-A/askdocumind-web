import { faRotate, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type ChangeEvent, type DragEvent, useCallback, useEffect, useRef, useState } from "react";
import {
	deleteUploadedDocument,
	getUploadedDocuments,
	uploadDocuments,
} from "@/api/document-endpoints.ts";
import { getApiErrorMessage } from "@/api/utils.ts";
import documentsData from "@/data/documents.json";
import { logger } from "@/lib/logger.ts";
import type { UUID } from "@/types/api.ts";
import type {
	ProcessingStatus,
	ProcessingStatusColoursMap,
	Document as UploadedDocument,
} from "@/types/documents.ts";

type DocumentTab = "upload" | "documents";

interface DocumentsAreaProps {
	theme: "light" | "dark";
	chatSessionId: UUID | null;
	isChatSessionLoading: boolean;
	activeTab: DocumentTab;
	onTabChange: (tab: DocumentTab) => void;
	documents: UploadedDocument[];
	selectedFiles: File[];
	maxUploadBytes: number;
	onFilesAdded: (files: File[]) => void;
	onRemoveSelectedFile: (file: File) => void;
	onUploadSuccess?: () => void;
	onUploadNotice?: (type: "success" | "error", message: string) => void;
	onDeleteNotice?: (type: "success" | "error", message: string) => void;
	onDocumentsRefreshed?: (docs: UploadedDocument[]) => void;
}

function getStatusStyle(status: ProcessingStatus, theme: "light" | "dark") {
	const palette = documentsData.processingStatuses as ProcessingStatusColoursMap;
	const statusPalette = palette[status];

	// Fallback to COMPLETED style if status is not found
	if (!statusPalette) {
		const fallbackPalette = palette.COMPLETED;
		const colours = fallbackPalette[theme];
		return {
			color: colours.textColour,
			backgroundColor: colours.backgroundColour,
		};
	}

	const colours = statusPalette[theme];

	return {
		color: colours.textColour,
		backgroundColor: colours.backgroundColour,
	};
}

export function DocumentsArea({
	theme,
	chatSessionId,
	isChatSessionLoading,
	activeTab,
	onTabChange,
	documents,
	selectedFiles,
	maxUploadBytes,
	onFilesAdded,
	onRemoveSelectedFile,
	onUploadSuccess,
	onUploadNotice,
	onDeleteNotice,
	onDocumentsRefreshed,
}: DocumentsAreaProps) {
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const [isDragActive, setIsDragActive] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [isFetchingDocuments, setIsFetchingDocuments] = useState(false);
	const [deletingDocumentId, setDeletingDocumentId] = useState<UUID | null>(null);

	const formatBytes = (bytes: number): string => {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
	};

	const formatMaxMb = (bytes: number): string => {
		const mb = bytes / (1024 * 1024);
		return Number.isInteger(mb) ? `${mb} MB` : `${mb.toFixed(1)} MB`;
	};

	const selectedTotalBytes = selectedFiles.reduce((sum, file) => sum + file.size, 0);

	const openFilePicker = () => fileInputRef.current?.click();

	const formatFileNamesForToast = (files: File[]): string => {
		if (files.length === 1) return files[0].name;
		if (files.length === 2) return `${files[0].name}, ${files[1].name}`;
		return `${files[0].name}, ${files[1].name} +${files.length - 2} more`;
	};

	const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(event.target.files || []);
		onFilesAdded(files);
		event.target.value = "";
	};

	const handleDrop = (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		setIsDragActive(false);
		const files = Array.from(event.dataTransfer.files || []);
		onFilesAdded(files);
	};

	const handleUploadWithAPI = async () => {
		if (!selectedFiles.length || !chatSessionId) {
			logger.error("No files selected or chat session not ready");
			return;
		}

		const filesSnapshot = [...selectedFiles];
		const fileNamesLabel = formatFileNamesForToast(filesSnapshot);

		setIsUploading(true);
		try {
			await uploadDocuments({
				chatSessionId,
				documents: filesSnapshot,
			});
			onUploadNotice?.("success", `${fileNamesLabel} uploaded.`);
			onUploadSuccess?.();

			// Refresh documents list
			await handleRefreshDocuments();
		} catch (error) {
			logger.error("Failed to upload documents:", error);
			const reason = getApiErrorMessage(error, `Failed to upload ${fileNamesLabel}.`);
			onUploadNotice?.("error", reason);
		} finally {
			setIsUploading(false);
		}
	};

	const handleRefreshDocuments = useCallback(async () => {
		if (!chatSessionId) return;

		setIsFetchingDocuments(true);
		try {
			const uploadedDocs = await getUploadedDocuments(chatSessionId);
			logger.log("Fetched uploaded documents:", uploadedDocs);
			onDocumentsRefreshed?.(uploadedDocs);
		} catch (error) {
			logger.error("Failed to fetch uploaded documents:", error);
			onDeleteNotice?.("error", "Failed to refresh documents. Please try again.");
		} finally {
			setIsFetchingDocuments(false);
		}
	}, [chatSessionId, onDocumentsRefreshed, onDeleteNotice]);

	const handleDeleteDocument = async (documentId: UUID, filename: string) => {
		if (!chatSessionId || deletingDocumentId) return;

		setDeletingDocumentId(documentId);
		try {
			await deleteUploadedDocument(documentId, chatSessionId);
			await handleRefreshDocuments();
			onDeleteNotice?.("success", `${filename} deleted.`);
		} catch (error) {
			logger.error("Failed to delete document:", error);
			onDeleteNotice?.("error", "Failed to delete document.");
		} finally {
			setDeletingDocumentId(null);
		}
	};

	// Fetch documents when chat session becomes available
	useEffect(() => {
		if (chatSessionId && !isChatSessionLoading) {
			void handleRefreshDocuments();
		}
	}, [chatSessionId, isChatSessionLoading, handleRefreshDocuments]);

	return (
		<section className="flex h-full w-full flex-col rounded-[2rem] border border-[var(--color-tertiary)] bg-[var(--color-secondary)] p-4 shadow-sm sm:p-6">
			<div className="mb-4 grid grid-cols-2 gap-2 rounded-xl bg-[var(--color-primary)] p-1">
				<button
					type="button"
					onClick={() => {
						logger.log("Tab switched: upload");
						onTabChange("upload");
					}}
					className={`rounded-lg px-3 py-2 text-[var(--text-base)] font-medium transition ${
						activeTab === "upload"
							? "bg-[var(--color-accent)] text-white"
							: "text-[var(--color-text)] hover:bg-[var(--color-tertiary)]"
					}`}
				>
					Upload Docs
				</button>
				<button
					type="button"
					onClick={() => {
						logger.log("Tab switched: uploaded documents");
						onTabChange("documents");
					}}
					className={`rounded-lg px-3 py-2 text-[var(--text-base)] font-medium transition ${
						activeTab === "documents"
							? "bg-[var(--color-accent)] text-white"
							: "text-[var(--color-text)] hover:bg-[var(--color-tertiary)]"
					}`}
				>
					Uploaded Docs
				</button>
			</div>

			{activeTab === "upload" ? (
				<section
					aria-label="File drop zone"
					className={`flex flex-1 flex-col rounded-2xl border border-dashed bg-[var(--color-primary)] p-4 transition ${
						isDragActive
							? "border-[var(--color-accent)] ring-2 ring-[var(--color-accent)]/20"
							: "border-[var(--color-tertiary)]"
					}`}
					onDragOver={(event) => {
						event.preventDefault();
						setIsDragActive(true);
					}}
					onDragLeave={() => setIsDragActive(false)}
					onDrop={handleDrop}
				>
					<input
						ref={fileInputRef}
						type="file"
						multiple
						accept=".pdf,.docx,.txt,.md"
						className="hidden"
						onChange={handleFileInputChange}
					/>

					<div className="flex flex-1 flex-col items-center justify-center text-center">
						<p className="text-[var(--text-base)] font-medium text-[var(--color-text)]">
							Drop files here
						</p>
						<p className="mt-1 text-[var(--text-sm)] text-[var(--color-text)]/70">
							or click one of the actions below
						</p>
					</div>

					{selectedFiles.length > 0 && (
						<div className="mb-3 max-h-40 space-y-1 overflow-auto rounded-xl border border-[var(--color-tertiary)] bg-[var(--color-secondary)] p-2">
							<p className="px-1 text-[var(--text-xs)] font-semibold text-[var(--color-text)]/75">
								Selected files ({selectedFiles.length}) -{" "}
								{formatBytes(selectedTotalBytes)} / {formatMaxMb(maxUploadBytes)}
							</p>
							{selectedFiles.map((file) => (
								<div
									key={`${file.name}:${file.size}:${file.lastModified}`}
									className="flex items-center justify-between gap-2 rounded-lg bg-[var(--color-primary)] px-2 py-1"
								>
									<div className="min-w-0">
										<p className="truncate text-[var(--text-xs)] font-medium text-[var(--color-text)]">
											{file.name}
										</p>
										<p className="text-[11px] text-[var(--color-text)]/65">
											{formatBytes(file.size)}
										</p>
									</div>
									<button
										type="button"
										onClick={() => onRemoveSelectedFile(file)}
										className="inline-flex items-center justify-center rounded-md p-1.5 text-[var(--color-text)]/70 transition hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400"
										aria-label={`Remove ${file.name}`}
									>
										<FontAwesomeIcon icon={faTrash} className="h-3.5 w-3.5" />
									</button>
								</div>
							))}
						</div>
					)}

					<div className="mt-4 flex flex-wrap justify-center gap-2">
						<button
							type="button"
							onClick={openFilePicker}
							className="rounded-xl border border-[var(--color-tertiary)] px-3 py-2 text-[var(--text-base)] text-[var(--color-text)] hover:border-[var(--color-accent)]"
							disabled={isChatSessionLoading}
						>
							Choose Files
						</button>
						<button
							type="button"
							onClick={handleUploadWithAPI}
							className="rounded-xl bg-[var(--color-accent)] px-3 py-2 text-[var(--text-base)] font-semibold text-white hover:opacity-90"
							disabled={isChatSessionLoading || isUploading || !chatSessionId}
						>
							{isUploading ? (
								<span className="inline-flex items-center gap-1.5">
									<span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
									Uploading...
								</span>
							) : (
								"Upload"
							)}
						</button>
					</div>
				</section>
			) : (
				<div className="relative flex-1 space-y-2 overflow-auto rounded-2xl border border-[var(--color-tertiary)] bg-[var(--color-primary)] p-3">
					{documents.length === 0 && !isFetchingDocuments && (
						<div className="flex h-full flex-col items-center justify-center gap-1 text-center">
							<p className="text-[var(--text-base)] font-medium text-[var(--color-text)]">
								No documents yet
							</p>
							<p className="text-[var(--text-sm)] text-[var(--color-text)]/60">
								Upload files from the Upload Docs tab to get started.
							</p>
						</div>
					)}
					{documents.map((doc) => (
						<article
							key={doc.id}
							className="rounded-xl border border-[var(--color-tertiary)] bg-[var(--color-secondary)] p-3 transition duration-150 hover:-translate-y-0.5 hover:border-[var(--color-accent)]/50 hover:shadow-sm"
						>
							<div className="flex items-center justify-between gap-2">
								<div>
									<p className="truncate text-[var(--text-base)] font-medium text-[var(--color-text)]">
										{doc.filename}
									</p>
									<p className="mt-1 text-[var(--text-sm)] text-[var(--color-text)]/75">
										{Math.round(doc.file_size / 1024)} KB
									</p>
								</div>
								<div className="flex items-center gap-2.5">
									<span
										className="rounded-full px-2.5 py-1 text-[var(--text-xs)] font-semibold whitespace-nowrap"
										style={getStatusStyle(doc.processing_status, theme)}
									>
										{doc.processing_status}
									</span>
									<button
										type="button"
										onClick={() =>
											void handleDeleteDocument(doc.id, doc.filename)
										}
										disabled={deletingDocumentId === doc.id}
										className="inline-flex items-center justify-center rounded-md p-2 text-[var(--color-text)]/70 transition hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400"
										aria-label="Delete document"
									>
										<FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
									</button>
								</div>
							</div>
						</article>
					))}
					<button
						type="button"
						onClick={handleRefreshDocuments}
						disabled={isFetchingDocuments || !chatSessionId}
						className="absolute bottom-3 right-3 inline-flex items-center justify-center rounded-md p-2 text-[var(--color-text)]/70 transition hover:text-[var(--color-accent)] disabled:opacity-50"
						aria-label="Refresh documents list"
					>
						<FontAwesomeIcon
							icon={faRotate}
							className={`h-5 w-5 ${isFetchingDocuments ? "animate-spin" : ""}`}
						/>
					</button>
				</div>
			)}
		</section>
	);
}

import { type ChangeEvent, type DragEvent, useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotate, faTrash } from "@fortawesome/free-solid-svg-icons";
import { uploadDocuments, getUploadedDocuments } from "@/api/document-endpoints.ts";
import documentsData from "@/data/documents.json";
import type {
    Document as UploadedDocument,
    ProcessingStatus,
    ProcessingStatusColoursMap,
} from "@/types/documents.ts";
import type { UUID } from "@/types/api.ts";

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
    onDocumentsRefreshed?: (docs: UploadedDocument[]) => void;
}

function getStatusStyle(status: ProcessingStatus, theme: "light" | "dark") {
    const palette = (documentsData.processingStatuses as ProcessingStatusColoursMap);
    const statusPalette = palette[status];
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
    onDocumentsRefreshed,
}: DocumentsAreaProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [isDragActive, setIsDragActive] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isFetchingDocuments, setIsFetchingDocuments] = useState(false);

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
            console.error("No files selected or chat session not ready");
            return;
        }

        setIsUploading(true);
        try {
            const quantityUploaded = await uploadDocuments({
                chatSessionId,
                documents: selectedFiles
            });
            console.log(`Successfully uploaded ${quantityUploaded} document(s)`);

            // Refresh documents list
            await handleRefreshDocuments();
        } catch (error) {
            console.error("Failed to upload documents:", error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleRefreshDocuments = async () => {
        if (!chatSessionId) return;

        setIsFetchingDocuments(true);
        try {
            const uploadedDocs = await getUploadedDocuments(chatSessionId);
            console.log("Fetched uploaded documents:", uploadedDocs);
            onDocumentsRefreshed?.(uploadedDocs);
        } catch (error) {
            console.error("Failed to fetch uploaded documents:", error);
        } finally {
            setIsFetchingDocuments(false);
        }
    };

    // Fetch documents when chat session becomes available
    useEffect(() => {
        if (chatSessionId && !isChatSessionLoading) {
            void handleRefreshDocuments();
        }
    }, [chatSessionId, isChatSessionLoading]);

    return (
        <section className="flex h-full min-h-[22rem] flex-col rounded-[2rem] border border-[var(--color-tertiary)] bg-[var(--color-secondary)] p-4 shadow-sm sm:min-h-[26rem] sm:p-6">
            <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl bg-[var(--color-primary)] p-1">
                <button
                    type="button"
                    onClick={() => {
                        console.log("Tab switched: upload");
                        onTabChange("upload");
                    }}
                    className={`rounded-lg px-3 py-2 text-base font-medium transition sm:text-sm ${
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
                        console.log("Tab switched: uploaded documents");
                        onTabChange("documents");
                    }}
                    className={`rounded-lg px-3 py-2 text-base font-medium transition sm:text-sm ${
                        activeTab === "documents"
                            ? "bg-[var(--color-accent)] text-white"
                            : "text-[var(--color-text)] hover:bg-[var(--color-tertiary)]"
                    }`}
                >
                    Uploaded Docs
                </button>
            </div>

            {activeTab === "upload" ? (
                <div
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
                        className="hidden"
                        onChange={handleFileInputChange}
                    />

                    <div className="flex flex-1 flex-col items-center justify-center text-center">
                        <p className="text-base font-medium text-[var(--color-text)] sm:text-sm">Drop files here</p>
                        <p className="mt-1 text-sm text-[var(--color-text)]/70 sm:text-xs">or click one of the actions below</p>
                    </div>

                    {selectedFiles.length > 0 && (
                        <div className="mb-3 max-h-40 space-y-1 overflow-auto rounded-xl border border-[var(--color-tertiary)] bg-[var(--color-secondary)] p-2">
                            <p className="px-1 text-xs font-semibold text-[var(--color-text)]/75">
                                Selected files ({selectedFiles.length}) - {formatBytes(selectedTotalBytes)} / {formatMaxMb(maxUploadBytes)}
                            </p>
                            {selectedFiles.map((file) => (
                                <div
                                    key={`${file.name}:${file.size}:${file.lastModified}`}
                                    className="flex items-center justify-between gap-2 rounded-lg bg-[var(--color-primary)] px-2 py-1"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate text-xs font-medium text-[var(--color-text)]">{file.name}</p>
                                        <p className="text-[11px] text-[var(--color-text)]/65">{formatBytes(file.size)}</p>
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
                            className="rounded-xl border border-[var(--color-tertiary)] px-3 py-2 text-base text-[var(--color-text)] hover:border-[var(--color-accent)] sm:text-sm"
                            disabled={isChatSessionLoading}
                        >
                            Choose Files
                        </button>
                        <button
                            type="button"
                            onClick={handleUploadWithAPI}
                            className="rounded-xl bg-[var(--color-accent)] px-3 py-2 text-base font-semibold text-white hover:opacity-90 sm:text-sm"
                            disabled={isChatSessionLoading || isUploading || !chatSessionId}
                        >
                            {isUploading ? "Uploading..." : "Upload"}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="relative flex-1 space-y-2 overflow-auto rounded-2xl border border-[var(--color-tertiary)] bg-[var(--color-primary)] p-3">
                    {documents.map((doc) => (
                        <article
                            key={doc.id}
                            className="rounded-xl border border-[var(--color-tertiary)] bg-[var(--color-secondary)] p-3 transition duration-150 hover:-translate-y-0.5 hover:border-[var(--color-accent)]/50 hover:shadow-sm"
                        >
                            <div className="flex items-center justify-between gap-2">
                                <div>
                                    <p className="truncate text-base font-medium text-[var(--color-text)] sm:text-sm">
                                        {doc.filename}
                                    </p>
                                    <p className="mt-1 text-sm text-[var(--color-text)]/75 sm:text-xs">
                                        {Math.round(doc.fileSize / 1024)} KB
                                    </p>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <span
                                        className="rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap sm:text-[11px]"
                                        style={getStatusStyle(doc.processingStatus, theme)}
                                    >
                                        {doc.processingStatus}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => console.log("Delete document clicked:", doc.id)}
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
                        <FontAwesomeIcon icon={faRotate} className="h-5 w-5" />
                    </button>
                </div>
            )}
        </section>
    );
}


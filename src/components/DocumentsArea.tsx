import type { Document as UploadedDocument } from "@/types/documents.ts";

type DocumentTab = "upload" | "documents";

interface DocumentsAreaProps {
    activeTab: DocumentTab;
    onTabChange: (tab: DocumentTab) => void;
    documents: UploadedDocument[];
}

function statusClass(status: UploadedDocument["processingStatus"]): string {
    switch (status) {
        case "COMPLETED":
            return "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300";
        case "FAILED":
            return "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300";
        case "PROCESSING":
            return "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300";
        default:
            return "bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-300";
    }
}

function IconTrash() {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m-1 0v14a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V6" />
            <path d="M10 9v8M14 9v8" />
        </svg>
    );
}

function IconRefresh() {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M3 9.5c0-2.8 2.2-5 5-5h3V2m-3 12c-2.8 0-5 2.2-5 5v3.5M21 14.5c0 2.8-2.2 5-5 5h-3v2.5m3-12c2.8 0 5-2.2 5-5V2" />
        </svg>
    );
}

export function DocumentsArea({ activeTab, onTabChange, documents }: DocumentsAreaProps) {
    return (
        <section className="flex h-full min-h-[22rem] flex-col rounded-[2rem] border border-[var(--color-tertiary)] bg-[var(--color-secondary)] p-4 shadow-sm sm:min-h-[26rem] sm:p-6">
            <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl bg-[var(--color-primary)] p-1">
                <button
                    type="button"
                    onClick={() => {
                        console.log("Tab switched: upload");
                        onTabChange("upload");
                    }}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
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
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                        activeTab === "documents"
                            ? "bg-[var(--color-accent)] text-white"
                            : "text-[var(--color-text)] hover:bg-[var(--color-tertiary)]"
                    }`}
                >
                    Uploaded Docs
                </button>
            </div>

            {activeTab === "upload" ? (
                <div className="flex flex-1 flex-col rounded-2xl border border-dashed border-[var(--color-tertiary)] bg-[var(--color-primary)] p-4">
                    <div className="flex flex-1 flex-col items-center justify-center text-center">
                        <p className="text-sm font-medium text-[var(--color-text)]">Drop files here</p>
                        <p className="mt-1 text-xs text-[var(--color-text)]/70">or click one of the actions below</p>
                    </div>

                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                        <button
                            type="button"
                            onClick={() => console.log("Choose files clicked")}
                            className="rounded-xl border border-[var(--color-tertiary)] px-3 py-2 text-sm text-[var(--color-text)] hover:border-[var(--color-accent)]"
                        >
                            Choose Files
                        </button>
                        <button
                            type="button"
                            onClick={() => console.log("Upload clicked")}
                            className="rounded-xl bg-[var(--color-accent)] px-3 py-2 text-sm font-semibold text-white hover:opacity-90"
                        >
                            Upload
                        </button>
                    </div>
                </div>
            ) : (
                <div className="relative flex-1 space-y-2 overflow-auto rounded-2xl border border-[var(--color-tertiary)] bg-[var(--color-primary)] p-3">
                    {documents.map((doc) => (
                        <article
                            key={doc.id}
                            className="rounded-xl border border-[var(--color-tertiary)] bg-[var(--color-secondary)] p-3"
                        >
                            <div className="flex items-center justify-between gap-2">
                                <div>
                                    <p className="truncate text-sm font-medium text-[var(--color-text)]">{doc.filename}</p>
                                    <p className="text-xs text-[var(--color-text)]/70">{Math.round(doc.fileSize / 1024)} KB</p>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className={`rounded-full px-2 py-1 text-[11px] font-semibold whitespace-nowrap ${statusClass(doc.processingStatus)}`}>
                                        {doc.processingStatus}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => console.log("Delete document clicked:", doc.id)}
                                        className="inline-flex items-center justify-center rounded-md p-1 text-[var(--color-text)]/70 transition hover:text-red-600 dark:hover:text-red-400"
                                        aria-label="Delete document"
                                    >
                                        <IconTrash />
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                    <button
                        type="button"
                        onClick={() => console.log("Refresh uploaded documents clicked")}
                        className="absolute bottom-3 right-3 inline-flex items-center justify-center rounded-md p-2 text-[var(--color-text)]/70 transition hover:text-[var(--color-accent)]"
                        aria-label="Refresh documents list"
                    >
                        <IconRefresh />
                    </button>
                </div>
            )}
        </section>
    );
}


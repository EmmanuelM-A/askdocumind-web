import type { Document as UploadedDocument } from "@/types/documents.ts";

type DocumentTab = "upload" | "documents";

interface DocumentsAreaProps {
    chatSessionId: string;
    activeTab: DocumentTab;
    onTabChange: (tab: DocumentTab) => void;
    documents: UploadedDocument[];
}

function statusClass(status: UploadedDocument["processingStatus"]): string {
    switch (status) {
        case "COMPLETED":
            return "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300";
        case "FAILED":
            return "bg-red-500/20 text-red-700 dark:text-red-300";
        case "PROCESSING":
            return "bg-amber-500/20 text-amber-700 dark:text-amber-300";
        default:
            return "bg-sky-500/20 text-sky-700 dark:text-sky-300";
    }
}

export function DocumentsArea({ chatSessionId, activeTab, onTabChange, documents }: DocumentsAreaProps) {
    return (
        <section className="flex h-full min-h-[22rem] flex-col rounded-[2rem] border border-[var(--color-tertiary)] bg-[var(--color-secondary)] p-4 shadow-sm sm:min-h-[26rem] sm:p-6">
            <header className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold tracking-[0.14em] text-[var(--color-text)] sm:text-base">
                    UPLOAD AREA
                </h2>
                <span className="rounded-full bg-[var(--color-primary)] px-3 py-1 text-[11px] font-medium text-[var(--color-text)]">
                    Chat: {chatSessionId}
                </span>
            </header>

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
                    Uploading Docs
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
                <div className="flex-1 space-y-2 overflow-auto rounded-2xl border border-[var(--color-tertiary)] bg-[var(--color-primary)] p-3">
                    {documents.map((doc) => (
                        <article
                            key={doc.id}
                            className="rounded-xl border border-[var(--color-tertiary)] bg-[var(--color-secondary)] p-3"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="truncate text-sm font-medium text-[var(--color-text)]">{doc.filename}</p>
                                    <p className="text-xs text-[var(--color-text)]/70">{Math.round(doc.fileSize / 1024)} KB</p>
                                </div>
                                <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${statusClass(doc.processingStatus)}`}>
                                    {doc.processingStatus}
                                </span>
                            </div>
                        </article>
                    ))}
                    <button
                        type="button"
                        onClick={() => console.log("Refresh uploaded documents clicked")}
                        className="mt-2 rounded-xl border border-[var(--color-tertiary)] px-3 py-2 text-sm text-[var(--color-text)] hover:border-[var(--color-accent)]"
                    >
                        Refresh List
                    </button>
                </div>
            )}
        </section>
    );
}


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotate, faTrash } from "@fortawesome/free-solid-svg-icons";
import documentsData from "@/data/documents.json";
import type {
    Document as UploadedDocument,
    ProcessingStatus,
    ProcessingStatusColoursMap,
} from "@/types/documents.ts";

type DocumentTab = "upload" | "documents";

interface DocumentsAreaProps {
    theme: "light" | "dark";
    activeTab: DocumentTab;
    onTabChange: (tab: DocumentTab) => void;
    documents: UploadedDocument[];
}

const fallbackStatusColours: ProcessingStatusColoursMap = {
    PENDING: {
        light: { textColour: "#ffffff", backgroundColour: "#1d4ed8" },
        dark: { textColour: "#ffffff", backgroundColour: "#1e40af" },
    },
    PROCESSING: {
        light: { textColour: "#ffffff", backgroundColour: "#b45309" },
        dark: { textColour: "#ffffff", backgroundColour: "#92400e" },
    },
    COMPLETED: {
        light: { textColour: "#ffffff", backgroundColour: "#047857" },
        dark: { textColour: "#ffffff", backgroundColour: "#065f46" },
    },
    FAILED: {
        light: { textColour: "#ffffff", backgroundColour: "#b91c1c" },
        dark: { textColour: "#ffffff", backgroundColour: "#991b1b" },
    },
};

function getStatusStyle(status: ProcessingStatus, theme: "light" | "dark") {
    const palette = (documentsData.processingStatuses as ProcessingStatusColoursMap) || fallbackStatusColours;
    const statusPalette = palette[status] || fallbackStatusColours[status];
    const colours = statusPalette[theme];

    return {
        color: colours.textColour,
        backgroundColor: colours.backgroundColour,
    };
}

export function DocumentsArea({ theme, activeTab, onTabChange, documents }: DocumentsAreaProps) {
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
                <div className="flex flex-1 flex-col rounded-2xl border border-dashed border-[var(--color-tertiary)] bg-[var(--color-primary)] p-4">
                    <div className="flex flex-1 flex-col items-center justify-center text-center">
                        <p className="text-base font-medium text-[var(--color-text)] sm:text-sm">Drop files here</p>
                        <p className="mt-1 text-sm text-[var(--color-text)]/70 sm:text-xs">or click one of the actions below</p>
                    </div>

                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                        <button
                            type="button"
                            onClick={() => console.log("Choose files clicked")}
                            className="rounded-xl border border-[var(--color-tertiary)] px-3 py-2 text-base text-[var(--color-text)] hover:border-[var(--color-accent)] sm:text-sm"
                        >
                            Choose Files
                        </button>
                        <button
                            type="button"
                            onClick={() => console.log("Upload clicked")}
                            className="rounded-xl bg-[var(--color-accent)] px-3 py-2 text-base font-semibold text-white hover:opacity-90 sm:text-sm"
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
                        onClick={() => console.log("Refresh uploaded documents clicked")}
                        className="absolute bottom-3 right-3 inline-flex items-center justify-center rounded-md p-2 text-[var(--color-text)]/70 transition hover:text-[var(--color-accent)]"
                        aria-label="Refresh documents list"
                    >
                        <FontAwesomeIcon icon={faRotate} className="h-5 w-5" />
                    </button>
                </div>
            )}
        </section>
    );
}


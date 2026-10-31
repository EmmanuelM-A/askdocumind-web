"use client";

import {
	faCloudArrowUp,
	faFileCode,
	faFileLines,
	faFilePdf,
	faFileWord,
	faRotateRight,
	faSpinner,
	faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type DragEvent, useRef, useState } from "react";
import { UPLOAD_LIMITS } from "@/config/constants";
import demoContent from "@/data/demo/content.json";
import { type DocumentRow, isProcessing } from "@/hooks/useDocuments";
import { formatBytes } from "@/lib/format";
import { ACCEPTED_EXTENSIONS } from "@/lib/uploads";

interface DocumentsPanelProps {
	rows: DocumentRow[];
	acceptedCount: number;
	isUploading: boolean;
	disabled: boolean;
	onAddFiles: (files: File[]) => void;
	onRemove: (row: DocumentRow) => void;
	onRetry: (row: DocumentRow) => void;
	onClearAll: () => void;
	onStartOver: () => void;
}

const { documents: content } = demoContent;

function getFileIcon(name: string) {
	const lower = name.toLowerCase();
	if (lower.endsWith(".pdf")) return faFilePdf;
	if (lower.endsWith(".docx")) return faFileWord;
	if (/\.(py|js|jsx|ts|tsx|java|go|html)$/.test(lower)) return faFileCode;
	return faFileLines;
}

function getBadge(row: DocumentRow): { label: string; className: string } {
	const busy = "bg-(--color-accent)/10 text-(--color-accent)";

	switch (row.status) {
		case "QUEUED":
			return {
				label: "Queued",
				className: "bg-(--color-tertiary)/60 text-(--color-text)/60",
			};
		case "UPLOADING":
			return { label: "Uploading", className: busy };
		case "PENDING":
		case "UPLOADED":
			return { label: "Waiting", className: busy };
		case "PROCESSING":
			return { label: "Processing", className: busy };
		case "COMPLETED":
			return {
				label: "Ready",
				className: "bg-(--color-success)/10 text-(--color-success)",
			};
		case "FAILED":
			return { label: "Failed", className: "bg-(--color-danger)/10 text-(--color-danger)" };
		case "REJECTED":
			return { label: "Rejected", className: "bg-(--color-danger)/10 text-(--color-danger)" };
	}
}

export function DocumentsPanel({
	rows,
	acceptedCount,
	isUploading,
	disabled,
	onAddFiles,
	onRemove,
	onRetry,
	onClearAll,
	onStartOver,
}: DocumentsPanelProps) {
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const [isDraggingOver, setIsDraggingOver] = useState(false);

	const hasUploadedDocuments = rows.some((row) => row.id);

	function handleDrop(event: DragEvent<HTMLDivElement>) {
		event.preventDefault();
		setIsDraggingOver(false);
		if (!disabled) onAddFiles(Array.from(event.dataTransfer.files));
	}

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: drag-and-drop has no ARIA role; the drop zone button is the accessible equivalent
		<div
			onDragOver={(event) => {
				event.preventDefault();
				setIsDraggingOver(true);
			}}
			onDragLeave={(event) => {
				if (!event.currentTarget.contains(event.relatedTarget as Node))
					setIsDraggingOver(false);
			}}
			onDrop={handleDrop}
			className="card flex h-full min-h-0 flex-col overflow-hidden rounded-2xl"
		>
			<div className="flex h-14 shrink-0 items-center justify-between border-b border-(--color-tertiary) px-4">
				<h2 className="font-semibold text-(--color-text)">{content.title}</h2>
				<span className="text-sm text-(--color-text)/50">
					{acceptedCount} of {UPLOAD_LIMITS.MAX_DOCUMENTS_PER_CHAT}
				</span>
			</div>

			<div className="flex min-h-0 flex-1 flex-col gap-4 p-4">
				<input
					ref={fileInputRef}
					type="file"
					multiple
					accept={ACCEPTED_EXTENSIONS.join(",")}
					className="hidden"
					onChange={(event) => {
						onAddFiles(Array.from(event.target.files ?? []));
						event.target.value = "";
					}}
				/>

				<button
					type="button"
					onClick={() => fileInputRef.current?.click()}
					disabled={disabled}
					className={`group flex items-center gap-3 rounded-xl border border-dashed p-3 text-left transition disabled:opacity-50 ${
						isDraggingOver
							? "border-(--color-accent) bg-(--color-accent)/10"
							: "border-(--color-tertiary) bg-(--color-primary) hover:border-(--color-accent)/60"
					}`}
				>
					<span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-(--color-accent)/10 text-(--color-accent) transition group-hover:scale-105">
						<FontAwesomeIcon icon={faCloudArrowUp} className="h-4! w-4!" />
					</span>
					<span className="min-w-0">
						<span className="block text-sm text-(--color-text)/80">
							{isDraggingOver ? (
								content.dropActive
							) : (
								<>
									{content.dropPrompt}{" "}
									<span className="font-semibold text-(--color-accent)">
										{content.choosePrompt}
									</span>
								</>
							)}
						</span>
						<span className="mt-0.5 block text-xs leading-snug text-(--color-text)/45">
							{content.limits}
						</span>
					</span>
				</button>

				<ul className="chat-scrollbar -mx-1 min-h-0 flex-1 space-y-1 overflow-y-auto px-1">
					{rows.length === 0 && (
						<li className="py-6 text-center text-sm text-(--color-text)/45">
							{content.empty}
						</li>
					)}

					{rows.map((row) => {
						const badge = getBadge(row);
						const isBusy = row.status === "UPLOADING" || isProcessing(row.status);
						const hasError =
							(row.status === "FAILED" ||
								row.status === "REJECTED" ||
								row.status === "QUEUED") &&
							row.message;

						return (
							<li
								key={row.key}
								className="group rounded-xl px-2 py-2 transition hover:bg-(--color-primary)"
							>
								<div className="flex items-center gap-3">
									<span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-(--color-tertiary) bg-(--color-primary) text-(--color-text)/60">
										<FontAwesomeIcon
											icon={getFileIcon(row.name)}
											className="h-4! w-4!"
										/>
									</span>

									<div className="min-w-0 flex-1 leading-tight">
										<p
											title={row.name}
											className="truncate text-sm font-medium text-(--color-text)"
										>
											{row.name}
										</p>
										<p className="mt-1 flex items-center gap-2 text-xs text-(--color-text)/50">
											{formatBytes(row.sizeBytes)}
											<span
												className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${badge.className}`}
											>
												{isBusy && (
													<FontAwesomeIcon
														icon={faSpinner}
														spin
														className="h-2.5! w-2.5!"
													/>
												)}
												{badge.label}
											</span>
										</p>
									</div>

									{row.status === "FAILED" && (
										<button
											type="button"
											onClick={() => onRetry(row)}
											aria-label={`Retry ${row.name}`}
											className="shrink-0 text-(--color-text)/50 transition hover:text-(--color-accent)"
										>
											<FontAwesomeIcon
												icon={faRotateRight}
												className="h-3.5! w-3.5!"
											/>
										</button>
									)}

									{row.status !== "UPLOADING" && (
										<button
											type="button"
											onClick={() => onRemove(row)}
											aria-label={`Remove ${row.name}`}
											className="shrink-0 text-(--color-text)/40 transition hover:text-red-500"
										>
											<FontAwesomeIcon
												icon={faXmark}
												className="h-3.5! w-3.5!"
											/>
										</button>
									)}
								</div>

								{hasError && (
									<p
										className={`mt-1.5 pl-12 text-xs ${
											row.status === "QUEUED"
												? "text-(--color-text)/50"
												: "text-red-500"
										}`}
									>
										{row.message}
									</p>
								)}
							</li>
						);
					})}
				</ul>
			</div>

			<div className="flex shrink-0 gap-2 border-t border-(--color-tertiary) px-4 py-3">
				<button
					type="button"
					onClick={() => {
						if (window.confirm(content.confirmClearAll)) onClearAll();
					}}
					disabled={disabled || isUploading || !hasUploadedDocuments}
					className="h-[3.125rem] flex-1 rounded-xl border border-(--color-tertiary) text-sm font-medium text-(--color-text)/70 transition hover:border-red-500/50 hover:text-red-500 disabled:pointer-events-none disabled:opacity-40"
				>
					Clear all
				</button>
				<button
					type="button"
					onClick={() => {
						if (window.confirm(content.confirmStartOver)) onStartOver();
					}}
					disabled={disabled || isUploading}
					className="h-[3.125rem] flex-1 rounded-xl border border-(--color-tertiary) text-sm font-medium text-(--color-text)/70 transition hover:border-(--color-accent)/60 hover:text-(--color-text) disabled:pointer-events-none disabled:opacity-40"
				>
					Start over
				</button>
			</div>
		</div>
	);
}

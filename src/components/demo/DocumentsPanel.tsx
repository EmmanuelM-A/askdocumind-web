"use client";

import {
	faCheck,
	faClock,
	faSpinner,
	faTriangleExclamation,
	faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type DragEvent, useRef, useState } from "react";
import { UPLOAD_LIMITS } from "@/config/constants";
import demoContent from "@/data/demo/content.json";
import type { DocumentRow } from "@/hooks/useDocuments";
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

function getStatusLabel(row: DocumentRow): string {
	switch (row.status) {
		case "QUEUED":
			return row.message ?? "Queued";
		case "UPLOADING":
			return "Uploading…";
		case "PENDING":
		case "UPLOADED":
			return "Waiting to process";
		case "PROCESSING":
			return "Processing…";
		case "COMPLETED":
			return "Ready";
		case "FAILED":
			return row.message ?? "Processing failed";
		case "REJECTED":
			return row.message ?? "Couldn't upload";
	}
}

function StatusIcon({ row }: { row: DocumentRow }) {
	if (row.status === "COMPLETED") {
		return <FontAwesomeIcon icon={faCheck} className="h-4! w-4! text-emerald-500" />;
	}
	if (row.status === "FAILED" || row.status === "REJECTED") {
		return <FontAwesomeIcon icon={faTriangleExclamation} className="h-4! w-4! text-red-500" />;
	}
	if (row.status === "QUEUED") {
		return <FontAwesomeIcon icon={faClock} className="h-4! w-4! text-(--color-text)/50" />;
	}
	return <FontAwesomeIcon icon={faSpinner} spin className="h-4! w-4! text-(--color-accent)" />;
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
		// biome-ignore lint/a11y/noStaticElementInteractions: drag-and-drop has no ARIA role; the "choose files" button is the accessible equivalent
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
			className={`flex h-full min-h-0 flex-col gap-3 rounded-2xl border p-4 transition-colors ${
				isDraggingOver
					? "border-(--color-accent) bg-(--color-accent)/10"
					: "border-(--color-tertiary) bg-(--color-secondary)"
			}`}
		>
			<div className="flex items-baseline justify-between">
				<h2 className="font-semibold text-(--color-text)">{content.title}</h2>
				<span className="text-xs text-(--color-text)/60">
					{acceptedCount}/{UPLOAD_LIMITS.MAX_DOCUMENTS_PER_CHAT}
				</span>
			</div>

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

			<div className="rounded-xl border border-dashed border-(--color-tertiary) bg-(--color-primary) p-4 text-center text-sm text-(--color-text)/70">
				{isDraggingOver ? (
					<p className="font-medium text-(--color-accent)">{content.dropActive}</p>
				) : (
					<p>
						{content.dropPrompt}{" "}
						<button
							type="button"
							onClick={() => fileInputRef.current?.click()}
							disabled={disabled}
							className="font-semibold text-(--color-accent) underline-offset-2 hover:underline disabled:opacity-50"
						>
							{content.choosePrompt}
						</button>
					</p>
				)}
				<p className="mt-2 text-xs text-(--color-text)/50">{content.limits}</p>
			</div>

			<ul className="chat-scrollbar min-h-0 flex-1 space-y-1 overflow-y-auto">
				{rows.length === 0 && (
					<li className="py-6 text-center text-sm text-(--color-text)/50">
						{content.empty}
					</li>
				)}

				{rows.map((row) => (
					<li
						key={row.key}
						className="flex items-center gap-3 rounded-xl bg-(--color-primary) px-3 py-2"
					>
						<StatusIcon row={row} />

						<div className="min-w-0 flex-1 leading-tight">
							<p
								title={row.name}
								className="truncate text-sm font-medium text-(--color-text)"
							>
								{row.name}
							</p>
							<p
								className={`text-xs ${
									row.status === "FAILED" || row.status === "REJECTED"
										? "text-red-500"
										: "text-(--color-text)/60"
								}`}
							>
								{formatBytes(row.sizeBytes)} · {getStatusLabel(row)}
							</p>
						</div>

						{row.status === "FAILED" && (
							<button
								type="button"
								onClick={() => onRetry(row)}
								className="shrink-0 text-xs font-semibold text-(--color-accent) hover:underline"
							>
								Retry
							</button>
						)}

						{row.status !== "UPLOADING" && (
							<button
								type="button"
								onClick={() => onRemove(row)}
								aria-label={`Remove ${row.name}`}
								className="shrink-0 text-(--color-text)/50 transition hover:text-red-500"
							>
								<FontAwesomeIcon icon={faXmark} className="h-3.5! w-3.5!" />
							</button>
						)}
					</li>
				))}
			</ul>

			<div className="flex gap-2">
				<button
					type="button"
					onClick={() => {
						if (window.confirm(content.confirmClearAll)) onClearAll();
					}}
					disabled={disabled || isUploading || !hasUploadedDocuments}
					className="flex-1 rounded-xl border border-(--color-tertiary) py-2 text-xs font-semibold text-(--color-text) transition hover:border-red-500 hover:text-red-500 disabled:pointer-events-none disabled:opacity-50"
				>
					Clear all
				</button>
				<button
					type="button"
					onClick={() => {
						if (window.confirm(content.confirmStartOver)) onStartOver();
					}}
					disabled={disabled || isUploading}
					className="flex-1 rounded-xl border border-(--color-tertiary) py-2 text-xs font-semibold text-(--color-text) transition hover:border-(--color-accent) hover:text-(--color-accent) disabled:pointer-events-none disabled:opacity-50"
				>
					Start over
				</button>
			</div>
		</div>
	);
}

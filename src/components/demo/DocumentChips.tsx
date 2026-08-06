"use client";

import {
	faCheck,
	faFileLines,
	faFolderOpen,
	faPlus,
	faTrash,
	faUpload,
	faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type ChangeEvent, type DragEvent, useEffect, useRef, useState } from "react";
import { deleteUploadedDocument } from "@/api/document-endpoints.ts";
import { formatBytes } from "@/lib/format.ts";
import { logger } from "@/lib/logger.ts";
import type { UUID } from "@/types/api.ts";

export interface DocumentChip {
	id: string;
	name: string;
	sizeLabel: string;
	status: "pending" | "uploaded";
	file?: File;
}

interface DocumentChipsProps {
	chatId: UUID | null;
	documents: DocumentChip[];
	onDocumentsChange: (documents: DocumentChip[]) => void;
	onUpload: () => void;
	isUploading: boolean;
}

export function DocumentChips({
	chatId,
	documents,
	onDocumentsChange,
	onUpload,
	isUploading,
}: DocumentChipsProps) {
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const scrollRef = useRef<HTMLDivElement | null>(null);
	const [isDraggingOver, setIsDraggingOver] = useState(false);
	const [isViewOpen, setIsViewOpen] = useState(false);

	const hasPendingDocuments = documents.some((doc) => doc.status === "pending");

	// Wheel (vertical scroll) over the chip list scrolls it horizontally instead,
	// but only when it's actually overflowing - otherwise let the page scroll normally.
	useEffect(() => {
		const el = scrollRef.current;
		if (!el) return;

		const handleWheel = (event: WheelEvent) => {
			if (el.scrollWidth <= el.clientWidth) return;

			event.preventDefault();
			el.scrollLeft += event.deltaY;
		};

		el.addEventListener("wheel", handleWheel, { passive: false });
		return () => el.removeEventListener("wheel", handleWheel);
	}, []);

	const addFiles = (files: File[]) => {
		if (files.length === 0) return;

		onDocumentsChange([
			...documents,
			...files.map((file) => ({
				id: `${file.name}-${file.lastModified}`,
				name: file.name,
				sizeLabel: formatBytes(file.size),
				status: "pending" as const,
				file,
			})),
		]);
	};

	const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		addFiles(Array.from(event.target.files ?? []));
		event.target.value = "";
	};

	const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		setIsDraggingOver(true);
	};

	const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
		if (event.currentTarget.contains(event.relatedTarget as Node)) return;
		setIsDraggingOver(false);
	};

	const handleDrop = (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		setIsDraggingOver(false);
		addFiles(Array.from(event.dataTransfer.files ?? []));
	};

	const removeDocument = async (doc: DocumentChip) => {
		onDocumentsChange(documents.filter((d) => d.id !== doc.id));

		if (doc.status !== "uploaded" || !chatId) return;

		try {
			await deleteUploadedDocument(doc.id as UUID, chatId);
			logger.info({ documentId: doc.id }, "Document deleted");
		} catch (error) {
			logger.error({ error }, "Failed to delete document");
		}
	};

	return (
		<>
			<input
				ref={fileInputRef}
				type="file"
				multiple
				accept=".pdf,.docx,.txt,.md"
				className="hidden"
				onChange={handleFileInputChange}
			/>

			{/* Small screens: three-action grid instead of the drag-and-drop pill row. */}
			<div className="grid w-full grid-cols-3 gap-2 sm:hidden">
				<button
					type="button"
					onClick={() => fileInputRef.current?.click()}
					className="flex flex-col items-center justify-center gap-1 rounded-xl border border-(--color-tertiary) bg-(--color-secondary) py-3 text-xs font-medium text-(--color-text) transition hover:border-(--color-accent)"
				>
					<FontAwesomeIcon icon={faPlus} className="h-4! w-4!" />
					Add
				</button>

				<button
					type="button"
					onClick={() => setIsViewOpen(true)}
					className="flex flex-col items-center justify-center gap-1 rounded-xl border border-(--color-tertiary) bg-(--color-secondary) py-3 text-xs font-medium text-(--color-text) transition hover:border-(--color-accent)"
				>
					<FontAwesomeIcon icon={faFolderOpen} className="h-4! w-4!" />
					View
				</button>

				<button
					type="button"
					onClick={onUpload}
					disabled={!hasPendingDocuments || isUploading}
					className="flex flex-col items-center justify-center gap-1 rounded-xl bg-(--color-accent) py-3 text-xs font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
				>
					<FontAwesomeIcon
						icon={faUpload}
						className={`h-4! w-4! ${isUploading ? "animate-pulse" : ""}`}
					/>
					{isUploading ? "Uploading" : "Upload"}
				</button>
			</div>

			{/* Larger screens: drag-and-drop pill row with inline scrolling. */}
			{/* biome-ignore lint/a11y/noStaticElementInteractions: drag-and-drop has no dedicated interactive ARIA role; the equivalent "Add document" button is fully keyboard-accessible */}
			<div
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
				className={`hidden min-w-0 flex-1 items-center gap-2 rounded-2xl border p-3 shadow-sm transition-colors sm:flex ${
					isDraggingOver
						? "border-(--color-accent) bg-(--color-accent)/10"
						: "border-(--color-tertiary) bg-(--color-secondary)"
				}`}
			>
				{isDraggingOver ? (
					<p className="pointer-events-none flex-1 py-2 text-center text-sm font-medium text-(--color-accent)">
						Drop files to add them
					</p>
				) : (
					<>
						<button
							type="button"
							onClick={() => fileInputRef.current?.click()}
							className="flex shrink-0 items-center justify-center gap-2 self-stretch rounded-xl border border-(--color-tertiary) px-3 text-sm text-(--color-text) transition hover:border-(--color-accent)"
						>
							<FontAwesomeIcon icon={faPlus} className="h-3.5! w-3.5!" />
							Add document
						</button>

						<div
							ref={scrollRef}
							className="flex min-w-0 flex-1 flex-nowrap items-center gap-2 overflow-x-auto"
						>
							{documents.map((doc) => (
								<div
									key={doc.id}
									className="flex shrink-0 items-center gap-2 rounded-xl border border-(--color-tertiary) bg-(--color-primary) px-3 py-2"
								>
									<FontAwesomeIcon
										icon={doc.status === "uploaded" ? faCheck : faFileLines}
										className={`h-4! w-4! ${
											doc.status === "uploaded"
												? "text-emerald-500"
												: "text-(--color-accent)"
										}`}
									/>
									<div className="min-w-0 leading-tight">
										<p
											title={doc.name}
											className="max-w-40 truncate text-xs font-medium text-(--color-text)"
										>
											{doc.name}
										</p>
										<p className="text-[11px] whitespace-nowrap text-(--color-text)/60">
											{doc.sizeLabel}
											{doc.status === "pending" && " · Pending"}
										</p>
									</div>
									<button
										type="button"
										onClick={() => void removeDocument(doc)}
										aria-label={`Remove ${doc.name}`}
										className="ml-1 shrink-0 text-(--color-text)/50 transition hover:text-red-500"
									>
										<FontAwesomeIcon icon={faXmark} className="h-3.5! w-3.5!" />
									</button>
								</div>
							))}
						</div>
					</>
				)}
			</div>

			{isViewOpen && (
				<div
					role="dialog"
					aria-modal="true"
					aria-label="Uploaded documents"
					className="fixed inset-0 z-50 flex items-end bg-black/60 sm:hidden"
					onClick={(event) => {
						if (event.target === event.currentTarget) setIsViewOpen(false);
					}}
					onKeyDown={(event) => {
						if (event.key === "Escape") setIsViewOpen(false);
					}}
				>
					<div className="flex max-h-[75vh] w-full flex-col rounded-t-3xl border-t border-(--color-tertiary) bg-(--color-primary)">
						<div className="flex shrink-0 items-center justify-between border-b border-(--color-tertiary) px-4 py-3">
							<p className="font-semibold text-(--color-text)">Uploaded documents</p>
							<button
								type="button"
								onClick={() => setIsViewOpen(false)}
								aria-label="Close"
								className="text-(--color-text)/60 transition hover:text-(--color-accent)"
							>
								<FontAwesomeIcon icon={faXmark} className="h-4! w-4!" />
							</button>
						</div>

						<div className="chat-scrollbar min-h-0 flex-1 overflow-y-auto p-2">
							{documents.length === 0 ? (
								<p className="p-6 text-center text-sm text-(--color-text)/50">
									No documents yet.
								</p>
							) : (
								documents.map((doc) => (
									<div
										key={doc.id}
										className="flex items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-(--color-secondary)"
									>
										<FontAwesomeIcon
											icon={doc.status === "uploaded" ? faCheck : faFileLines}
											className={`h-5! w-5! shrink-0 ${
												doc.status === "uploaded"
													? "text-emerald-500"
													: "text-(--color-accent)"
											}`}
										/>
										<div className="min-w-0 flex-1">
											<p
												title={doc.name}
												className="truncate text-sm font-medium text-(--color-text)"
											>
												{doc.name}
											</p>
											<p className="text-xs text-(--color-text)/60">
												{doc.sizeLabel}
												{doc.status === "pending" && " · Pending"}
											</p>
										</div>
										<button
											type="button"
											onClick={() => void removeDocument(doc)}
											aria-label={`Delete ${doc.name}`}
											className="shrink-0 text-(--color-text)/50 transition hover:text-red-500"
										>
											<FontAwesomeIcon icon={faTrash} className="h-4! w-4!" />
										</button>
									</div>
								))
							)}
						</div>
					</div>
				</div>
			)}
		</>
	);
}

"use client";

import { faCheck, faFileLines, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type ChangeEvent, type DragEvent, useEffect, useRef, useState } from "react";

export interface DocumentChip {
	id: string;
	name: string;
	sizeLabel: string;
	status: "pending" | "uploaded";
	file: File;
}

interface DocumentChipsProps {
	documents: DocumentChip[];
	onDocumentsChange: (documents: DocumentChip[]) => void;
}

function formatBytes(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function DocumentChips({ documents, onDocumentsChange }: DocumentChipsProps) {
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const scrollRef = useRef<HTMLDivElement | null>(null);
	const [isDraggingOver, setIsDraggingOver] = useState(false);

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

	const removeDocument = (id: string) => {
		onDocumentsChange(documents.filter((doc) => doc.id !== id));
	};

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: drag-and-drop has no dedicated interactive ARIA role; the equivalent "Add document" button below is fully keyboard-accessible
		<div
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
			className={`flex min-w-0 flex-1 items-center gap-2 rounded-2xl border p-3 shadow-sm transition-colors ${
				isDraggingOver
					? "border-(--color-accent) bg-(--color-accent)/10"
					: "border-(--color-tertiary) bg-(--color-secondary)"
			}`}
		>
			<input
				ref={fileInputRef}
				type="file"
				multiple
				accept=".pdf,.docx,.txt,.md"
				className="hidden"
				onChange={handleFileInputChange}
			/>

			{isDraggingOver ? (
				<p className="pointer-events-none flex-1 py-2 text-center text-sm font-medium text-(--color-accent)">
					Drop files to add them
				</p>
			) : (
				<>
					<button
						type="button"
						onClick={() => fileInputRef.current?.click()}
						className="flex shrink-0 items-center gap-2 rounded-xl border border-(--color-tertiary) px-3 py-2 text-sm text-(--color-text) transition hover:border-(--color-accent)"
					>
						<FontAwesomeIcon icon={faPlus} className="h-3.5! w-3.5!" />
						Add document
					</button>

					<div
						ref={scrollRef}
						className="flex min-w-0 flex-1 flex-nowrap items-center gap-2 overflow-x-auto pb-3"
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
								<div className="leading-tight">
									<p className="text-xs font-medium whitespace-nowrap text-(--color-text)">
										{doc.name}
									</p>
									<p className="text-[11px] whitespace-nowrap text-(--color-text)/60">
										{doc.sizeLabel}
										{doc.status === "pending" && " · Pending"}
									</p>
								</div>
								<button
									type="button"
									onClick={() => removeDocument(doc.id)}
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
	);
}

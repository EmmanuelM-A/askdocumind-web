"use client";

import { faFileLines, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type ChangeEvent, useRef, useState } from "react";

interface DocumentChip {
	id: string;
	name: string;
	sizeLabel: string;
}

function formatBytes(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function DocumentChips() {
	const [documents, setDocuments] = useState<DocumentChip[]>([]);
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(event.target.files ?? []);
		setDocuments((prev) => [
			...prev,
			...files.map((file) => ({
				id: `${file.name}-${file.lastModified}`,
				name: file.name,
				sizeLabel: formatBytes(file.size),
			})),
		]);
		event.target.value = "";
	};

	const removeDocument = (id: string) => {
		setDocuments((prev) => prev.filter((doc) => doc.id !== id));
	};

	return (
		<div className="flex shrink-0 flex-wrap items-center gap-2 rounded-2xl border border-(--color-tertiary) bg-(--color-secondary) p-3 shadow-sm">
			<input
				ref={fileInputRef}
				type="file"
				multiple
				accept=".pdf,.docx,.txt,.md"
				className="hidden"
				onChange={handleFileInputChange}
			/>

			{documents.map((doc) => (
				<div
					key={doc.id}
					className="flex items-center gap-2 rounded-xl border border-(--color-tertiary) bg-(--color-primary) px-3 py-2"
				>
					<FontAwesomeIcon
						icon={faFileLines}
						className="h-4! w-4! text-(--color-accent)"
					/>
					<div className="leading-tight">
						<p className="text-xs font-medium text-(--color-text)">{doc.name}</p>
						<p className="text-[11px] text-(--color-text)/60">{doc.sizeLabel}</p>
					</div>
					<button
						type="button"
						onClick={() => removeDocument(doc.id)}
						aria-label={`Remove ${doc.name}`}
						className="ml-1 text-(--color-text)/50 transition hover:text-red-500"
					>
						<FontAwesomeIcon icon={faXmark} className="h-3.5! w-3.5!" />
					</button>
				</div>
			))}

			<button
				type="button"
				onClick={() => fileInputRef.current?.click()}
				className="flex items-center gap-2 rounded-xl border border-(--color-tertiary) px-3 py-2 text-sm text-(--color-text) transition hover:border-(--color-accent)"
			>
				<FontAwesomeIcon icon={faPlus} className="h-3.5! w-3.5!" />
				Add document
			</button>
		</div>
	);
}

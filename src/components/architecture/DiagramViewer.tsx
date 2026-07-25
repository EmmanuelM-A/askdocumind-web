"use client";

import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useEffect, useState } from "react";

interface DiagramViewerProps {
	name: string;
	diagram: string | null;
}

export function DiagramViewer({ name, diagram }: DiagramViewerProps) {
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		if (!isOpen) return;

		const scrollContainer = document.getElementById("page-scroll");
		const previousOverflow = scrollContainer?.style.overflow;
		if (scrollContainer) scrollContainer.style.overflow = "hidden";

		return () => {
			if (scrollContainer) scrollContainer.style.overflow = previousOverflow ?? "";
		};
	}, [isOpen]);

	return (
		<>
			<button
				type="button"
				onClick={() => setIsOpen(true)}
				className="flex h-72 w-full cursor-zoom-in items-center justify-center rounded-3xl border border-dashed border-(--color-tertiary) bg-(--color-secondary) text-sm text-(--color-text)/40 transition hover:border-(--color-accent) sm:h-104"
			>
				{diagram ? name : `[ ${name} diagram placeholder ]`}
			</button>

			{isOpen && (
				<div
					role="dialog"
					aria-modal="true"
					aria-label={`${name} diagram preview`}
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
					onClick={(event) => {
						if (event.target === event.currentTarget) setIsOpen(false);
					}}
					onKeyDown={(event) => {
						if (event.key === "Escape") setIsOpen(false);
					}}
				>
					<button
						type="button"
						onClick={() => setIsOpen(false)}
						aria-label="Close diagram preview"
						className="absolute top-6 right-6 flex h-16 w-16 items-center justify-center text-white transition hover:text-(--color-accent)"
					>
						<FontAwesomeIcon icon={faXmark} className="h-10 w-10" />
					</button>

					{diagram ? (
						<Image
							src={diagram}
							alt={name}
							width={1400}
							height={900}
							className="max-h-[85vh] w-auto max-w-[90vw] rounded-2xl object-contain"
						/>
					) : (
						<div className="flex h-72 w-full max-w-2xl items-center justify-center rounded-3xl bg-(--color-secondary) text-sm text-(--color-text)/40 sm:h-104">
							{`[ ${name} diagram placeholder ]`}
						</div>
					)}
				</div>
			)}
		</>
	);
}

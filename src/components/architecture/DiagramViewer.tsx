"use client";

import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useEffect, useState } from "react";

interface DiagramViewerProps {
	name: string;
	diagramLight: string | null;
	diagramDark: string | null;
}

export function DiagramViewer({ name, diagramLight, diagramDark }: DiagramViewerProps) {
	const [isOpen, setIsOpen] = useState(false);
	const hasDiagram = Boolean(diagramLight && diagramDark);

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
				disabled={!hasDiagram}
				className="flex h-48 w-full cursor-zoom-in items-center justify-center overflow-hidden rounded-3xl border border-dashed border-(--color-tertiary) bg-(--color-secondary) p-4 text-sm text-(--color-text)/40 transition hover:border-(--color-accent) disabled:cursor-default sm:h-72 md:h-104"
			>
				{hasDiagram ? (
					<>
						<Image
							src={diagramLight as string}
							alt={name}
							width={1400}
							height={900}
							unoptimized
							className="theme-photo-light h-full w-full object-contain"
						/>
						<Image
							src={diagramDark as string}
							alt={name}
							width={1400}
							height={900}
							unoptimized
							className="theme-photo-dark h-full w-full object-contain"
						/>
					</>
				) : (
					`[ ${name} diagram placeholder ]`
				)}
			</button>

			{isOpen && hasDiagram && (
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

					<Image
						src={diagramLight as string}
						alt={name}
						width={1400}
						height={900}
						unoptimized
						className="theme-photo-light max-h-[85vh] w-auto max-w-[90vw] rounded-2xl object-contain"
					/>
					<Image
						src={diagramDark as string}
						alt={name}
						width={1400}
						height={900}
						unoptimized
						className="theme-photo-dark max-h-[85vh] w-auto max-w-[90vw] rounded-2xl object-contain"
					/>
				</div>
			)}
		</>
	);
}

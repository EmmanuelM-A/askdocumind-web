import Link from "next/link";

export function BackLink() {
	return (
		<Link
			href="/"
			className="mb-8 inline-flex items-center gap-1.5 text-sm text-(--color-accent) transition hover:opacity-75"
		>
			<svg
				aria-hidden="true"
				viewBox="0 0 24 24"
				className="h-4 w-4"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
			>
				<path d="M19 12H5M12 5l-7 7 7 7" />
			</svg>
			Back to app
		</Link>
	);
}

export function SectionHeading({ number, title }: { number: number; title: string }) {
	return (
		<h2 className="mt-10 mb-3 flex items-baseline gap-2 text-lg font-semibold text-(--color-text)">
			<span className="font-bold text-(--color-accent)">{number}.</span>
			{title}
		</h2>
	);
}

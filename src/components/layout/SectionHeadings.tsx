export function NumberedSectionHeading({ number, title }: { number: number; title: string }) {
	return (
		<h2 className="mt-10 mb-3 flex items-baseline gap-2 text-lg font-semibold text-(--color-text)">
			<span className="font-bold text-(--color-accent)">{number}.</span>
			{title}
		</h2>
	);
}

/**
 * Section heading with horizontal lines on either side, used for separating sections of content.
 */
export function SectionHeading({ title }: { title: string }) {
	return (
		<div className="my-10 flex items-center gap-4">
			<span className="h-px flex-1 bg-(--color-tertiary)" />
			<h2 className="shrink-0 text-sm font-semibold tracking-widest text-(--color-accent) uppercase">
				{title}
			</h2>
			<span className="h-px flex-1 bg-(--color-tertiary)" />
		</div>
	);
}

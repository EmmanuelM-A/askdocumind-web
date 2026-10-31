/**
 * Section heading with a number prefix, used for numbered sections of content.
 */
export function NumberedSectionHeading({ number, title }: { number: number; title: string }) {
	return (
		<h2 className="mt-10 mb-3 flex items-baseline gap-2 text-lg font-semibold text-(--color-text)">
			<span className="font-bold text-(--color-accent)">{number}.</span>
			{title}
		</h2>
	);
}

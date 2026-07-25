import Link from "next/link";

/**
 * Renders a back link button that navigates to the specified URL.
 *
 * @param buttonText - The text to display on the back link button.
 * @param backTo - The URL to navigate to when the back link button is clicked.
 * @returns A JSX element representing the back link button.
 */
export function BackLink(buttonText: string, backTo: string) {
	return (
		<Link
			href={backTo}
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
			{buttonText}
		</Link>
	);
}

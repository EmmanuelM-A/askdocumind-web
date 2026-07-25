import { faScrewdriverWrench } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ComingSoonProps {
	title?: string;
	description?: string;
}

export function ComingSoon({
	title = "Coming Soon",
	description = "This page isn't ready yet, but it's on the way. Check back soon.",
}: ComingSoonProps) {
	return (
		<div className="flex w-full flex-1 flex-col items-center justify-center gap-6 px-4 py-16 text-center">
			<FontAwesomeIcon
				icon={faScrewdriverWrench}
				className="h-[8.4rem]! w-[8.4rem]! text-(--color-accent)"
			/>

			<h1 className="whitespace-nowrap text-[clamp(1.75rem,6vw,4.5rem)] font-bold text-(--color-text)">
				{title}
			</h1>
			<p className="max-w-md text-sm text-(--color-text)/70">{description}</p>
		</div>
	);
}

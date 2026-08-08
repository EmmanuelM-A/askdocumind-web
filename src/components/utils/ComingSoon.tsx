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
				className="h-16! w-16! text-(--color-accent) sm:h-24! sm:w-24! md:h-[8.4rem]! md:w-[8.4rem]!"
			/>

			<h1 className="text-balance text-[clamp(1.5rem,7vw,4.5rem)] font-bold text-(--color-text)">
				{title}
			</h1>
			<p className="max-w-md text-sm text-(--color-text)/70">{description}</p>
		</div>
	);
}

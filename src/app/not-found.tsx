import { faCompass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function NotFound() {
	return (
		<div className="flex w-full flex-1 flex-col items-center justify-center gap-6 px-4 py-16 text-center">
			<FontAwesomeIcon
				icon={faCompass}
				className="h-16! w-16! text-(--color-accent) sm:h-24! sm:w-24! md:h-[8.4rem]! md:w-[8.4rem]!"
			/>

			<h1 className="text-balance text-[clamp(1.5rem,7vw,4.5rem)] font-bold text-(--color-text)">
				404 - Page Not Found
			</h1>
			<p className="max-w-md text-sm text-(--color-text)/70">
				The page you're looking for doesn't exist or may have been moved.
			</p>

			<Link
				href="/"
				className="rounded-full bg-(--color-accent) px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
			>
				Back to Home
			</Link>
		</div>
	);
}

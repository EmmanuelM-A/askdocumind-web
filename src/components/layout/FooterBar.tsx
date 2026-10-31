import Link from "next/link";
import footerData from "@/data/layout/footer.json";

export function FooterBar() {
	return (
		<footer className="shrink-0 border-t border-(--color-tertiary) bg-(--color-primary)">
			<div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-(--color-text)/60 sm:flex-row sm:items-center sm:justify-between sm:px-6">
				<p>
					{footerData.copyright}
					<span className="ml-2 text-(--color-text)/40">{footerData.version}</span>
				</p>

				<nav aria-label="Footer" className="flex gap-4">
					{footerData.links.map((link) =>
						link.href.startsWith("http") ? (
							<a
								key={link.name}
								href={link.href}
								target="_blank"
								rel="noopener noreferrer"
								className="transition hover:text-(--color-text)"
							>
								{link.name}
							</a>
						) : (
							<Link
								key={link.name}
								href={link.href}
								className="transition hover:text-(--color-text)"
							>
								{link.name}
							</Link>
						),
					)}
				</nav>
			</div>
		</footer>
	);
}

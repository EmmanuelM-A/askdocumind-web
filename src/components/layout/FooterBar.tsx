import Link from "next/link";
import footerData from "@/data/footer.json";

export function FooterBar() {
	return (
		<footer className="shrink-0 border-t border-(--color-tertiary) bg-(--color-primary)">
			<div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-3 px-4 py-4 text-center sm:px-6">
				<p className="text-2xl font-bold text-(--color-text)">{footerData.appName}</p>

				<p className="text-sm text-(--color-text)/70">{footerData.description}</p>

				<nav
					aria-label="Footer navigation"
					className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-(--color-text)/80"
				>
					{footerData.links.map((link, index) => (
						<span key={link.name} className="flex items-center gap-2">
							{index > 0 && <span className="text-(--color-text)/40">•</span>}
							{link.href.startsWith("/") ? (
								<Link
									href={link.href}
									className="transition hover:text-(--color-accent)"
								>
									{link.name}
								</Link>
							) : (
								<a
									href={link.href}
									target={link.href.startsWith("http") ? "_blank" : undefined}
									rel={
										link.href.startsWith("http")
											? "noopener noreferrer"
											: undefined
									}
									className="transition hover:text-(--color-accent)"
								>
									{link.name}
								</a>
							)}
						</span>
					))}
					<span className="flex items-center gap-2">
						<span className="text-(--color-text)/40">•</span>
						<span>{footerData.version}</span>
					</span>
				</nav>

				<p className="text-xs text-(--color-text)/50">{footerData.copyright}</p>
			</div>
		</footer>
	);
}

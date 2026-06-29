import { Link } from "react-router-dom";
import footerData from "@/data/footer.json";

export function FooterBar() {
	return (
		<footer className="border-t border-[var(--color-tertiary)] bg-[var(--color-primary)]/85 py-2">
			<div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
				<div className="grid gap-1 py-1 sm:grid-cols-3 sm:items-center sm:gap-4">
					<div className="flex items-baseline justify-center gap-2 sm:justify-start">
						<p className="text-lg font-semibold text-[var(--color-text)]">
							{footerData.appName}
						</p>
						<p className="text-sm text-[var(--color-text)]/60">v{__APP_VERSION__}</p>
					</div>

					<p className="text-center text-sm text-[var(--color-text)]/70">
						{footerData.description}
					</p>

					<nav
						aria-label="Footer navigation"
						className="flex items-center justify-center gap-4 sm:justify-end"
					>
						{footerData.links.map((link) =>
							link.href.startsWith("/") ? (
								<Link
									key={link.name}
									to={link.href}
									className="text-sm text-[var(--color-text)]/60 transition hover:text-[var(--color-accent)]"
								>
									{link.name}
								</Link>
							) : (
								<a
									key={link.name}
									href={link.href}
									className="text-sm text-[var(--color-text)]/60 transition hover:text-[var(--color-accent)]"
								>
									{link.name}
								</a>
							),
						)}
					</nav>
				</div>
			</div>
		</footer>
	);
}

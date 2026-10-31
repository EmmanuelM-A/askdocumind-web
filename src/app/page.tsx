import Link from "next/link";
import { DemoWorkspace } from "@/components/demo/DemoWorkspace";
import { HowItWorks } from "@/components/demo/HowItWorks";
import demoContent from "@/data/demo/content.json";

export default function HomePage() {
	const { headline, description, links } = demoContent.intro;

	return (
		<>
			<section className="mx-auto flex h-[calc(100dvh-5rem)] min-h-[36rem] w-full max-w-6xl flex-col gap-4 px-4 pt-4 pb-6 sm:px-6">
				<header className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<h1 className="text-xl font-bold tracking-tight text-(--color-text) sm:text-2xl">
							{headline}
						</h1>
						<p className="mt-1 max-w-2xl text-sm text-(--color-text)/70">
							{description}
						</p>
					</div>

					<nav aria-label="Project links" className="flex shrink-0 gap-2">
						{links.map((link) => {
							const className =
								"rounded-full border border-(--color-tertiary) px-4 py-1.5 text-sm font-semibold text-(--color-text) transition hover:border-(--color-accent) hover:text-(--color-accent)";

							return link.href.startsWith("http") ? (
								<a
									key={link.label}
									href={link.href}
									target="_blank"
									rel="noopener noreferrer"
									className={className}
								>
									{link.label}
								</a>
							) : (
								<Link key={link.label} href={link.href} className={className}>
									{link.label}
								</Link>
							);
						})}
					</nav>
				</header>

				<DemoWorkspace />
			</section>

			<HowItWorks />
		</>
	);
}

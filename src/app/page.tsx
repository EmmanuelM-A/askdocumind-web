import { faCode, faSitemap } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { DemoWorkspace } from "@/components/demo/DemoWorkspace";
import { HowItWorks } from "@/components/demo/HowItWorks";
import demoContent from "@/data/demo/content.json";

export default function HomePage() {
	const { headline, headlineAccent, description, links } = demoContent.intro;

	return (
		<>
			<div className="w-full">
				<section className="mx-auto flex h-[calc(100dvh-5rem)] min-h-[40rem] w-full max-w-6xl flex-col gap-6 px-4 pt-6 pb-6 sm:px-6">
					<header className="flex shrink-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
						<div>
							<h1 className="text-3xl font-semibold tracking-tight text-(--color-text) sm:text-4xl">
								{headline}{" "}
								<span className="text-(--color-accent)">{headlineAccent}</span>
							</h1>
							<p className="mt-2 max-w-2xl text-sm text-(--color-text)/60 sm:text-base">
								{description}
							</p>
						</div>

						<nav aria-label="Project links" className="hidden shrink-0 gap-2 sm:flex">
							{links.map((link) => {
								const isExternal = link.href.startsWith("http");
								const className =
									"card flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-(--color-text)/80 transition hover:border-(--color-accent)/60 hover:text-(--color-text)";
								const content = (
									<>
										<FontAwesomeIcon
											icon={isExternal ? faCode : faSitemap}
											className="h-3.5! w-3.5! text-(--color-accent)"
										/>
										{link.label}
									</>
								);

								return isExternal ? (
									<a
										key={link.label}
										href={link.href}
										target="_blank"
										rel="noopener noreferrer"
										className={className}
									>
										{content}
									</a>
								) : (
									<Link key={link.label} href={link.href} className={className}>
										{content}
									</Link>
								);
							})}
						</nav>
					</header>

					<DemoWorkspace />
				</section>
			</div>

			<HowItWorks />
		</>
	);
}

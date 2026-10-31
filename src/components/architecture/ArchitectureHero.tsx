import architectureData from "@/data/architecture/architecture.json";

export function ArchitectureHero() {
	return (
		// biome-ignore lint/correctness/useUniqueElementIds: anchor-link target for a singleton section, needs a stable id
		<section
			id="introduction"
			className="flex min-h-[calc(100dvh-4rem)] w-full shrink-0 flex-col items-center justify-center gap-4 px-4 py-16 text-center sm:px-6"
		>
			<h1 className="text-4xl font-semibold tracking-tight text-balance text-(--color-text) sm:text-5xl">
				{architectureData.title}
			</h1>
			<p className="max-w-2xl text-sm leading-relaxed text-(--color-text)/60 sm:text-base">
				{architectureData.description}
			</p>
		</section>
	);
}

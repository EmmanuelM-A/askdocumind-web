import architectureData from "@/data/architecture.json";

export function ArchitectureHero() {
	return (
		// biome-ignore lint/correctness/useUniqueElementIds: anchor-link target for a singleton section, needs a stable id
		<section
			id="introduction"
			className="flex h-[calc(100vh-5rem)] w-full shrink-0 flex-col items-center justify-center gap-4 px-4 text-center sm:px-6"
		>
			<h1 className="text-4xl font-bold tracking-tight text-balance text-(--color-text) sm:text-5xl">
				{architectureData.title}
			</h1>
			<p className="max-w-2xl text-(--color-text)/70">{architectureData.description}</p>
		</section>
	);
}

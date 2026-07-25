import architectureData from "@/data/architecture.json";

export function ArchitectureHero() {
	const { eyebrow, headline, subheadline } = architectureData.hero;

	return (
		<div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-3 px-4 pt-12 pb-4 text-center sm:px-6">
			<p className="text-sm font-semibold tracking-wide text-(--color-accent) uppercase">
				{eyebrow}
			</p>
			<h1 className="text-3xl font-bold tracking-tight text-balance text-(--color-text) sm:text-4xl">
				{headline}
			</h1>
			<p className="text-(--color-text)/70">{subheadline}</p>
		</div>
	);
}

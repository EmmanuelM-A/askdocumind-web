import homeData from "@/data/home.json";

export function WhyItMattersSection() {
	const { title, features } = homeData.whyItMatters;

	return (
		<section className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
			<h2 className="text-center text-2xl font-bold tracking-tight text-(--color-text) sm:text-3xl">
				{title}
			</h2>

			<div className="mt-10 grid gap-4 sm:grid-cols-2">
				{features.map((feature) => (
					<div
						key={feature.title}
						className="rounded-2xl border border-(--color-tertiary) bg-(--color-secondary) p-6 shadow-sm"
					>
						<p className="font-semibold text-(--color-text)">{feature.title}</p>
						<p className="mt-1 text-sm text-(--color-text)/70">{feature.description}</p>
					</div>
				))}
			</div>
		</section>
	);
}

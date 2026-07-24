import homeData from "@/data/home.json";

export function HowItWorksSection() {
	const { title, steps } = homeData.howItWorks;

	return (
		<section className="bg-(--color-secondary)/60">
			<div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
				<h2 className="text-center text-2xl font-bold tracking-tight text-(--color-text) sm:text-3xl">
					{title}
				</h2>

				<div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{steps.map((step) => (
						<div
							key={step.number}
							className="flex flex-col items-center gap-2 rounded-2xl border border-(--color-tertiary) bg-(--color-primary) p-6 text-center shadow-sm"
						>
							<span className="flex h-9 w-9 items-center justify-center rounded-full bg-(--color-accent) text-sm font-semibold text-white">
								{step.number}
							</span>
							<p className="font-semibold text-(--color-text)">{step.title}</p>
							<p className="text-sm text-(--color-text)/70">{step.description}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

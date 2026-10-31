import demoContent from "@/data/demo/content.json";

export function HowItWorks() {
	const { heading, steps, techStackHeading, techStack } = demoContent.howItWorks;

	return (
		<section className="w-full">
			<div className="mx-auto w-full max-w-6xl px-4 py-32 sm:px-6 sm:py-56">
				<h2 className="text-center text-2xl font-semibold tracking-tight text-(--color-text) sm:text-3xl">
					{heading}
				</h2>

				<ol className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{steps.map((step, index) => (
						<li key={step.title} className="card flex flex-col gap-3 rounded-2xl p-6">
							<span className="flex h-8 w-8 items-center justify-center rounded-lg bg-(--color-accent-strong) font-mono text-sm font-semibold text-white">
								{index + 1}
							</span>
							<p className="font-semibold text-(--color-text)">{step.title}</p>
							<p className="text-sm leading-relaxed text-(--color-text)/60">
								{step.description}
							</p>
						</li>
					))}
				</ol>

				<p className="mt-40 text-center text-xs font-medium tracking-widest text-(--color-text)/45 uppercase sm:mt-52">
					{techStackHeading}
				</p>

				<div className="relative mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
					<div className="flex w-max animate-[marquee_40s_linear_infinite] gap-12">
						{[...techStack, ...techStack].map((tech, index) => (
							<span
								// biome-ignore lint/suspicious/noArrayIndexKey: marquee is a decorative repeating list, values are duplicated
								key={index}
								className="text-base whitespace-nowrap text-(--color-text)/70"
							>
								{tech}
							</span>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

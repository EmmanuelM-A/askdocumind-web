import demoContent from "@/data/demo/content.json";

export function HowItWorks() {
	const { heading, steps, techStackHeading, techStack } = demoContent.howItWorks;

	return (
		<section className="w-full">
			<div className="mx-auto w-full max-w-6xl px-4 py-32 sm:px-6 sm:py-56">
				<h2 className="text-2xl font-semibold tracking-tight text-(--color-text) sm:text-3xl">
					{heading}
				</h2>

				<ol className="mt-12 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
					{steps.map((step, index) => (
						<li key={step.title} className="border-t border-(--color-tertiary) pt-5">
							<p className="flex items-baseline gap-3 font-semibold text-(--color-text)">
								<span className="text-(--color-accent) tabular-nums">
									{index + 1}
								</span>
								{step.title}
							</p>
							<p className="mt-2 text-sm leading-relaxed text-(--color-text)/65">
								{step.description}
							</p>
						</li>
					))}
				</ol>

				<h2 className="mt-40 text-2xl font-semibold tracking-tight text-(--color-text) sm:mt-52 sm:text-3xl">
					{techStackHeading}
				</h2>

				<dl className="mt-12 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-3">
					{techStack.map((group) => (
						<div key={group.label} className="border-t border-(--color-tertiary) pt-5">
							<dt className="font-semibold text-(--color-text)">{group.label}</dt>
							<dd className="mt-2 text-sm leading-relaxed text-(--color-text)/65">
								<ul className="space-y-1">
									{group.items.map((item) => (
										<li key={item}>{item}</li>
									))}
								</ul>
							</dd>
						</div>
					))}
				</dl>
			</div>
		</section>
	);
}

import Link from "next/link";
import demoContent from "@/data/demo/content.json";

export function HowItWorks() {
	const { heading, steps, techStackHeading, techStack, ctaText, cta } = demoContent.howItWorks;

	return (
		<section className="w-full">
			<div className="mx-auto w-full max-w-5xl px-4 py-20 sm:px-6 sm:py-28">
				<h2 className="text-center text-2xl font-bold tracking-tight text-(--color-text) sm:text-3xl">
					{heading}
				</h2>

				<div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{steps.map((step, index) => (
						<div
							key={step.title}
							className="flex flex-col items-center gap-2 rounded-2xl border border-(--color-tertiary) bg-(--color-secondary) p-[1.6rem] text-center shadow-sm"
						>
							<span className="flex h-9 w-9 items-center justify-center rounded-full bg-(--color-accent) text-sm font-semibold text-white">
								{index + 1}
							</span>
							<p className="font-semibold text-(--color-text)">{step.title}</p>
							<p className="text-sm text-(--color-text)/70">{step.description}</p>
						</div>
					))}
				</div>

				<p className="mt-24 text-center text-sm font-semibold tracking-wide text-(--color-text)/50 uppercase">
					{techStackHeading}
				</p>

				<div className="relative mt-4 overflow-hidden">
					<div className="flex w-max animate-[marquee_30s_linear_infinite] gap-12">
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

				<div className="mt-20 flex flex-col items-center gap-4 text-center">
					<p className="text-(--color-text)/70">{ctaText}</p>
					<Link
						href={cta.href}
						className="rounded-full bg-(--color-accent) px-8 py-4 text-base font-bold text-white transition hover:opacity-90"
					>
						{cta.label}
					</Link>
				</div>
			</div>
		</section>
	);
}

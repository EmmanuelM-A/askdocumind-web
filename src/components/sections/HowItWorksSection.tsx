import {
	faCircleCheck,
	faCloudArrowUp,
	faCommentDots,
	faGears,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import homeData from "@/data/home/home.json";

const stepIcons: Record<string, typeof faCloudArrowUp> = {
	"1": faCloudArrowUp,
	"2": faGears,
	"3": faCommentDots,
	"4": faCircleCheck,
};

export function HowItWorksSection() {
	const { title, steps } = homeData.howItWorks;
	const { description, badges, cta } = homeData.builtWith;

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
							<span className="flex h-11 w-11 items-center justify-center rounded-full bg-(--color-accent) text-white">
								<FontAwesomeIcon
									icon={stepIcons[step.number]}
									className="h-5 w-5"
								/>
							</span>
							<p className="font-semibold text-(--color-text)">{step.title}</p>
							<p className="text-sm text-(--color-text)/70">{step.description}</p>
						</div>
					))}
				</div>

				<div className="mt-16 flex flex-col items-center gap-6 text-center">
					<div className="flex flex-wrap items-center justify-center gap-2">
						{badges.map((badge) => (
							<span
								key={badge}
								className="rounded-full border border-(--color-tertiary) bg-(--color-primary) px-4 py-1.5 text-sm text-(--color-text)/80"
							>
								{badge}
							</span>
						))}
					</div>

					<p className="text-(--color-text)/70">{description}</p>

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

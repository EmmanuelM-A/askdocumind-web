import Link from "next/link";
import homeData from "@/data/home.json";

export function Hero() {
	const { eyebrow, headline, subheadline, primaryCta, secondaryCta } = homeData.hero;

	return (
		<section className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-4 py-20 text-center sm:px-6 sm:py-28">
			<p className="text-sm font-semibold tracking-wide text-(--color-accent) uppercase">
				{eyebrow}
			</p>

			<h1 className="text-4xl font-bold tracking-tight text-balance text-(--color-text) sm:text-5xl">
				{headline}
			</h1>

			<p className="max-w-2xl text-lg text-balance text-(--color-text)/70">{subheadline}</p>

			<div className="mt-2 flex flex-wrap items-center justify-center gap-3">
				<Link
					href={primaryCta.href}
					className="rounded-full bg-(--color-accent) px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
				>
					{primaryCta.label}
				</Link>
				<a
					href={secondaryCta.href}
					target="_blank"
					rel="noopener noreferrer"
					className="rounded-full border border-(--color-tertiary) px-6 py-3 text-sm font-semibold text-(--color-text) transition hover:border-(--color-accent) hover:text-(--color-accent)"
				>
					{secondaryCta.label}
				</a>
			</div>

			<div className="mt-8 flex h-56 w-full max-w-2xl items-center justify-center rounded-3xl border border-dashed border-(--color-tertiary) bg-(--color-secondary) text-sm text-(--color-text)/40">
				[ product preview / screenshot placeholder ]
			</div>
		</section>
	);
}

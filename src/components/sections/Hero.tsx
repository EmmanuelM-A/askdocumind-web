import Link from "next/link";
import homeData from "@/data/home/home.json";

export function Hero() {
	const { eyebrow, headline, subheadline, buttons } = homeData.hero;

	return (
		<section className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl flex-col items-center justify-center gap-6 px-4 text-center sm:px-6">
			<p className="text-sm font-semibold tracking-wide text-(--color-accent) uppercase">
				{eyebrow}
			</p>

			<h1 className="text-4xl font-bold tracking-tight text-balance text-(--color-text) sm:text-5xl">
				{headline}
			</h1>

			<p className="max-w-2xl text-lg text-balance text-(--color-text)/70">{subheadline}</p>

			<div className="mt-2 flex flex-wrap items-center justify-center gap-3">
				{buttons.map((button, index) => {
					const isExternal = button.href.startsWith("http");
					const className =
						index === 0
							? "rounded-full bg-(--color-accent) px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
							: "rounded-full border border-(--color-tertiary) px-6 py-3 text-sm font-semibold text-(--color-text) transition hover:border-(--color-accent) hover:text-(--color-accent)";

					return isExternal ? (
						<a
							key={button.label}
							href={button.href}
							target="_blank"
							rel="noopener noreferrer"
							className={className}
						>
							{button.label}
						</a>
					) : (
						<Link key={button.label} href={button.href} className={className}>
							{button.label}
						</Link>
					);
				})}
			</div>

			<div className="mt-8 flex h-56 w-full max-w-2xl items-center justify-center rounded-3xl border border-dashed border-(--color-tertiary) bg-(--color-secondary) text-sm text-(--color-text)/40">
				[ product preview / screenshot placeholder ]
			</div>
		</section>
	);
}

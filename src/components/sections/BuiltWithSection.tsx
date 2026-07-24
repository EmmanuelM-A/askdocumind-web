import Link from "next/link";
import homeData from "@/data/home.json";

export function BuiltWithSection() {
	const { title, description, badges, cta } = homeData.builtWith;

	return (
		<section className="bg-(--color-secondary)/60">
			<div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6 sm:py-20">
				<h2 className="text-2xl font-bold tracking-tight text-(--color-text) sm:text-3xl">
					{title}
				</h2>

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
					className="rounded-full bg-(--color-accent) px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
				>
					{cta.label}
				</Link>
			</div>
		</section>
	);
}

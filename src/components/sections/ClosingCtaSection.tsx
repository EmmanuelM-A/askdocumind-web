import Link from "next/link";
import homeData from "@/data/home/home.json";

export function ClosingCtaSection() {
	const { heading, description, cta } = homeData.closingCta;

	return (
		<section className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8 px-4 py-56 text-center sm:px-6">
			<div className="flex flex-col items-center gap-5">
				<h2 className="text-2xl font-bold tracking-tight text-(--color-text) sm:text-3xl">
					{heading}
				</h2>
				<p className="text-(--color-text)/70">{description}</p>
			</div>
			<Link
				href={cta.href}
				className="rounded-full bg-(--color-accent) px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
			>
				{cta.label}
			</Link>
		</section>
	);
}

import Link from "next/link";
import homeData from "@/data/home/home.json";

export function ClosingCtaSection() {
	const { title, description, cta } = homeData.closingCta;

	return (
		<section className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl flex-col items-center justify-center gap-4 px-4 text-center sm:px-6">
			<h2 className="text-2xl font-bold tracking-tight text-(--color-text) sm:text-3xl">
				{title}
			</h2>
			<p className="text-(--color-text)/70">{description}</p>
			<Link
				href={cta.href}
				className="mt-2 rounded-full bg-(--color-accent) px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
			>
				{cta.label}
			</Link>
		</section>
	);
}

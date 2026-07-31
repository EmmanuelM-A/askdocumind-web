import Image from "next/image";
import Link from "next/link";
import homeData from "@/data/home/home.json";

export function Hero() {
	const { eyebrow, headline, subheadline, buttons, productPhoto } = homeData.hero;

	return (
		<section className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl flex-col items-center justify-center gap-4 px-4 py-12 text-center sm:gap-6 sm:px-6">
			<p className="text-sm font-semibold tracking-wide text-(--color-accent) uppercase">
				{eyebrow}
			</p>

			<h1 className="text-2xl font-bold tracking-tight text-balance text-(--color-text) sm:text-3xl md:text-4xl">
				{headline}
			</h1>

			<p className="max-w-2xl text-sm text-balance text-(--color-text)/70 sm:text-base">
				{subheadline}
			</p>

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

			<div className="mt-6 flex h-44 w-full max-w-2xl items-center justify-center overflow-hidden rounded-3xl border border-dashed border-(--color-tertiary) bg-(--color-secondary) text-sm text-(--color-text)/40 sm:mt-8 sm:h-56 md:h-64">
				{productPhoto ? (
					<Image
						src={productPhoto}
						alt="Image of AskDocuMind in use"
						width={640}
						height={360}
						className="h-full w-full object-cover"
					/>
				) : (
					"Image of AskDocuMind in use"
				)}
			</div>
		</section>
	);
}

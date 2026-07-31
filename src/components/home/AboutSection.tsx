import Image from "next/image";
import homeData from "@/data/home/home.json";

export function AboutSection() {
	const { heading, body, image } = homeData.about;

	return (
		<section className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8 px-4 py-16 md:flex-row md:px-6 md:py-20">
			<div className="space-y-3 text-center md:flex-1 md:text-left">
				<h2 className="text-2xl font-bold tracking-tight text-(--color-text) sm:text-3xl">
					{heading}
				</h2>
				<p className="text-(--color-text)/70">{body}</p>
			</div>

			<div className="flex h-56 w-full items-center justify-center overflow-hidden rounded-3xl border border-dashed border-(--color-tertiary) bg-(--color-secondary) text-sm text-(--color-text)/40 sm:h-72 md:h-80 md:flex-1 lg:h-96">
				{image ? (
					<Image
						src={image}
						alt="Diagram explaining what AskDocuMind is"
						width={480}
						height={320}
						className="h-full w-full object-cover"
					/>
				) : (
					"Diagram explaining what AskDocuMind is"
				)}
			</div>
		</section>
	);
}

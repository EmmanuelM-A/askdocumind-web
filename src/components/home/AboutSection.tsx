import Image from "next/image";
import homeData from "@/data/home/home.json";

export function AboutSection() {
	const { heading, body, image } = homeData.about;

	return (
		<section className="mx-auto flex min-h-[70vh] w-full max-w-5xl flex-col items-center gap-8 px-4 py-16 sm:flex-row sm:px-6 sm:py-20">
			<div className="flex-1 space-y-3 text-center sm:text-left">
				<h2 className="text-2xl font-bold tracking-tight text-(--color-text) sm:text-3xl">
					{heading}
				</h2>
				<p className="text-(--color-text)/70">{body}</p>
			</div>

			<div className="flex h-80 w-full flex-1 items-center justify-center overflow-hidden rounded-3xl border border-dashed border-(--color-tertiary) bg-(--color-secondary) text-sm text-(--color-text)/40 sm:h-96">
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

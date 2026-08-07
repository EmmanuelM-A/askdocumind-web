import Image from "next/image";
import homeData from "@/data/home/home.json";

export function AboutSection() {
	const { heading, body, diagramLight, diagramDark } = homeData.about;

	return (
		<section className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8 px-4 py-16 md:flex-row md:px-6 md:py-20">
			<div className="space-y-3 text-center md:flex-1 md:text-left">
				<h2 className="text-2xl font-bold tracking-tight text-(--color-text) sm:text-3xl">
					{heading}
				</h2>
				<p className="text-(--color-text)/70">{body}</p>
			</div>

			<Image
				src={diagramLight}
				alt="Diagram of how AskDocuMind answers a question from an uploaded document"
				width={858}
				height={198}
				unoptimized
				className="theme-photo-light h-auto w-full min-w-0 rounded-3xl md:flex-1"
			/>
			<Image
				src={diagramDark}
				alt="Diagram of how AskDocuMind answers a question from an uploaded document"
				width={858}
				height={198}
				unoptimized
				className="theme-photo-dark h-auto w-full min-w-0 rounded-3xl md:flex-1"
			/>
		</section>
	);
}

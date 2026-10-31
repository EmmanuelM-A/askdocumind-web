import { DemoWorkspace } from "@/components/demo/DemoWorkspace";
import { HowItWorks } from "@/components/demo/HowItWorks";
import demoContent from "@/data/demo/content.json";

export default function HomePage() {
	const { headline, description } = demoContent.intro;

	return (
		<>
			<section className="mx-auto flex h-[calc(100dvh-4rem)] min-h-[40rem] w-full max-w-6xl flex-col gap-6 px-4 pt-8 pb-6 sm:px-6">
				<header className="shrink-0">
					<h1 className="text-3xl font-semibold tracking-tight text-(--color-text) sm:text-4xl">
						{headline}
					</h1>
					<p className="mt-2 max-w-2xl text-sm text-(--color-text)/60 sm:text-base">
						{description}
					</p>
				</header>

				<DemoWorkspace />
			</section>

			<HowItWorks />
		</>
	);
}

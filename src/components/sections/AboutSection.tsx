import homeData from "@/data/home/home.json";

export function AboutSection() {
	const { title, body } = homeData.about;

	return (
		<section className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8 px-4 py-16 sm:flex-row sm:px-6 sm:py-20">
			<div className="flex-1 space-y-3 text-center sm:text-left">
				<h2 className="text-2xl font-bold tracking-tight text-(--color-text) sm:text-3xl">
					{title}
				</h2>
				<p className="text-(--color-text)/70">{body}</p>
			</div>

			<div className="flex h-48 w-full flex-1 items-center justify-center rounded-3xl border border-dashed border-(--color-tertiary) bg-(--color-secondary) text-sm text-(--color-text)/40">
				[ diagram / illustration placeholder ]
			</div>
		</section>
	);
}

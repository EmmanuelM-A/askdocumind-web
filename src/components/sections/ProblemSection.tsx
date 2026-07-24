import homeData from "@/data/home.json";

export function ProblemSection() {
	const { title, body } = homeData.problem;

	return (
		<section className="bg-(--color-secondary)/60">
			<div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-4 px-4 py-16 text-center sm:px-6">
				<h2 className="text-2xl font-bold tracking-tight text-(--color-text) sm:text-3xl">
					{title}
				</h2>
				<p className="max-w-2xl text-(--color-text)/70">{body}</p>
			</div>
		</section>
	);
}

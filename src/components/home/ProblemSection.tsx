import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import homeData from "@/data/home/home.json";
import { resolveIcon } from "@/lib/icon-registry";

export function ProblemSection() {
	const { heading, subtext, cards } = homeData.problem;

	return (
		<section className="flex w-full items-center justify-center bg-(--color-secondary)/60">
			<div className="mx-auto flex w-full max-w-5xl flex-col items-center px-4 py-16 text-center sm:px-6 sm:py-20">
				<div className="flex flex-col items-center gap-3">
					<h2 className="text-2xl font-bold tracking-tight text-(--color-text) sm:text-3xl">
						{heading}
					</h2>

					<p className="mx-auto max-w-2xl text-lg text-balance text-(--color-text)/70">
						{subtext}
					</p>
				</div>

				<div className="mt-12 grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{cards.map((card, index) => {
						const icon = resolveIcon(card.icon);

						return (
							<div
								// biome-ignore lint/suspicious/noArrayIndexKey: cards are a fixed, non-reorderable list with no unique field
								key={index}
								className="flex flex-col items-center gap-3 rounded-2xl border border-(--color-tertiary) bg-(--color-primary) p-6 text-center shadow-sm"
							>
								{icon && (
									<FontAwesomeIcon
										icon={icon}
										className="h-10! w-10! text-(--color-accent)"
									/>
								)}
								<p className="text-center text-sm text-(--color-text)/70">
									{card.description}
								</p>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}

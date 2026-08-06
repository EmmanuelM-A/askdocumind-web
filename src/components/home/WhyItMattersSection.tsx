import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import homeData from "@/data/home/home.json";
import { resolveIcon } from "@/lib/icon-registry";

export function WhyItMattersSection() {
	const { heading, reasons } = homeData.whyItMatters;

	return (
		<section className="w-full bg-(--color-secondary)/60">
			<div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
				<h2 className="text-center text-2xl font-bold tracking-tight text-(--color-text) sm:text-3xl">
					{heading}
				</h2>

				<div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{reasons.map((item) => {
						const icon = resolveIcon(item.icon);

						return (
							<div
								key={item.reason}
								className="flex items-start gap-4 rounded-2xl border border-(--color-tertiary) bg-(--color-primary) p-6 shadow-sm"
							>
								{icon && (
									<FontAwesomeIcon
										icon={icon}
										className="h-10! w-10! shrink-0 text-(--color-accent)"
									/>
								)}
								<div>
									<p className="font-semibold text-(--color-text)">
										{item.reason}
									</p>
									<p className="mt-1 text-sm text-(--color-text)/70">
										{item.explanation}
									</p>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}

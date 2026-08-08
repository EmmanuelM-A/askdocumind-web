import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import homeData from "@/data/home/home.json";
import { resolveIcon } from "@/lib/icon-registry";

export function WhoThisIsForSection() {
	const { heading, audience } = homeData.whoThisIsFor;

	return (
		<section className="w-full bg-(--color-secondary)/60">
			<div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-10 px-4 py-16 text-center sm:gap-16 sm:px-6 sm:py-20">
				<h2 className="text-2xl font-bold tracking-tight text-(--color-text) sm:text-3xl">
					{heading}
				</h2>

				<div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{audience.map((item) => {
						const icon = resolveIcon(item.icon);

						return (
							<div
								key={item.description}
								className="flex flex-col items-center gap-4 rounded-2xl border border-(--color-tertiary) bg-(--color-primary) p-8 shadow-sm"
							>
								{icon && (
									<FontAwesomeIcon
										icon={icon}
										className="h-12! w-12! text-(--color-accent)"
									/>
								)}
								<p className="text-(--color-text)/80">{item.description}</p>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}

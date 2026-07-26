import {
	faBolt,
	faBookOpen,
	faCodeBranch,
	faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import homeData from "@/data/home/home.json";

const featureIcons: Record<string, typeof faBolt> = {
	"Grounded answers": faBookOpen,
	Fast: faBolt,
	"Session-based & private": faShieldHalved,
	"Open source": faCodeBranch,
};

export function WhyItMattersSection() {
	const { title, features } = homeData.whyItMatters;

	return (
		<section className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
			<h2 className="text-center text-2xl font-bold tracking-tight text-(--color-text) sm:text-3xl">
				{title}
			</h2>

			<div className="mt-10 grid gap-4 sm:grid-cols-2">
				{features.map((feature) => (
					<div
						key={feature.title}
						className="flex items-start gap-4 rounded-2xl border border-(--color-tertiary) bg-(--color-secondary) p-6 shadow-sm"
					>
						<span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-(--color-accent) text-white">
							<FontAwesomeIcon
								icon={featureIcons[feature.title]}
								className="h-5 w-5"
							/>
						</span>
						<div>
							<p className="font-semibold text-(--color-text)">{feature.title}</p>
							<p className="mt-1 text-sm text-(--color-text)/70">
								{feature.description}
							</p>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

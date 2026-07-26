import {
	faBolt,
	faBookOpen,
	faCodeBranch,
	faFileImport,
	faPlug,
	faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import homeData from "@/data/home/home.json";

const reasonIcons: Record<string, typeof faBolt> = {
	"Grounded answers": faBookOpen,
	Fast: faBolt,
	"Session-based & private": faShieldHalved,
	"Open source": faCodeBranch,
	"Multi-format support": faFileImport,
	"Easy integration": faPlug,
};

export function WhyItMattersSection() {
	const { heading, reasons } = homeData.whyItMatters;

	return (
		<section className="flex min-h-[calc((100vh-5rem)*0.85)] w-full items-center justify-center bg-(--color-secondary)/60">
			<div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
				<h2 className="text-center text-2xl font-bold tracking-tight text-(--color-text) sm:text-3xl">
					{heading}
				</h2>

				<div className="mt-16 grid gap-4 sm:grid-cols-2">
					{reasons.map((item) => (
						<div
							key={item.reason}
							className="flex items-start gap-4 rounded-2xl border border-(--color-tertiary) bg-(--color-primary) p-6 shadow-sm"
						>
							<FontAwesomeIcon
								icon={reasonIcons[item.reason]}
								className="h-10! w-10! shrink-0 text-(--color-accent)"
							/>
							<div>
								<p className="font-semibold text-(--color-text)">{item.reason}</p>
								<p className="mt-1 text-sm text-(--color-text)/70">
									{item.explanation}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

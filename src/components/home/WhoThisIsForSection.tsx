import { faCode, faFileLines, faGraduationCap } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import homeData from "@/data/home/home.json";

const audienceIcons = [faCode, faGraduationCap, faFileLines];

export function WhoThisIsForSection() {
	const { heading, audience } = homeData.whoThisIsFor;

	return (
		<section className="flex min-h-[70vh] w-full items-center justify-center bg-(--color-secondary)/60">
			<div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-16 px-4 py-16 text-center sm:px-6 sm:py-20">
				<h2 className="text-2xl font-bold tracking-tight text-(--color-text) sm:text-3xl">
					{heading}
				</h2>

				<div className="grid w-full gap-6 sm:grid-cols-3">
					{audience.map((item, index) => (
						<div
							key={item.description}
							className="flex flex-col items-center gap-4 rounded-2xl border border-(--color-tertiary) bg-(--color-primary) p-8 shadow-sm"
						>
							<FontAwesomeIcon
								icon={audienceIcons[index]}
								className="h-12! w-12! text-(--color-accent)"
							/>
							<p className="text-(--color-text)/80">{item.description}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

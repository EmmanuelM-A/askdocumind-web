import { faCode, faFileLines, faGraduationCap } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import homeData from "@/data/home/home.json";

const audienceIcons = [faCode, faGraduationCap, faFileLines];

export function WhoThisIsForSection() {
	const { title, audience } = homeData.whoThisIsFor;

	return (
		<section className="bg-(--color-secondary)/60">
			<div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-4 px-4 py-16 text-center sm:px-6 sm:py-20">
				<h2 className="text-2xl font-bold tracking-tight text-(--color-text) sm:text-3xl">
					{title}
				</h2>

				<div className="mt-6 grid gap-4 sm:grid-cols-3">
					{audience.map((item, index) => (
						<div
							key={item}
							className="flex flex-col items-center gap-3 rounded-2xl border border-(--color-tertiary) bg-(--color-primary) p-6 shadow-sm"
						>
							<span className="flex h-11 w-11 items-center justify-center rounded-full bg-(--color-accent) text-white">
								<FontAwesomeIcon icon={audienceIcons[index]} className="h-5 w-5" />
							</span>
							<p className="text-sm text-(--color-text)/80">{item}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

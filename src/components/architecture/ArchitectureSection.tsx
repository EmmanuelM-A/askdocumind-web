interface ArchitectureSectionProps {
	id: string;
	number: number;
	name: string;
	diagram: string | null;
	description: string;
}

export function ArchitectureSection({
	id,
	number,
	name,
	diagram,
	description,
}: ArchitectureSectionProps) {
	return (
		<section id={id} className="scroll-mt-24">
			<h2 className="mb-3 flex items-baseline gap-2 text-lg font-semibold text-(--color-text)">
				<span className="font-bold text-(--color-accent)">{number}.</span>
				{name}
			</h2>

			<div className="flex h-64 w-full items-center justify-center rounded-3xl border border-dashed border-(--color-tertiary) bg-(--color-secondary) text-sm text-(--color-text)/40 sm:h-80">
				{diagram ? name : `[ ${name} diagram placeholder ]`}
			</div>

			<div className="mt-3 rounded-2xl border border-(--color-tertiary) bg-(--color-secondary) p-4 text-sm text-(--color-text)/70">
				{description}
			</div>
		</section>
	);
}

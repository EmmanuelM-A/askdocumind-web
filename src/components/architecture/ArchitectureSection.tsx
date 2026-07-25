import { SectionHeadingWithLines } from "@/components/layout/SectionHeadings";
import type { ArchitectureDiagram } from "@/lib/architecture";

export function ArchitectureSection({ id, name, diagram, description }: ArchitectureDiagram) {
	return (
		<section id={id} className="flex min-h-[70vh] w-full flex-col justify-center scroll-mt-24">
			<div className="-mt-6 [&_h2]:text-lg">
				<SectionHeadingWithLines title={name} />
			</div>

			<div className="flex h-72 w-full items-center justify-center rounded-3xl border border-dashed border-(--color-tertiary) bg-(--color-secondary) text-sm text-(--color-text)/40 sm:h-104">
				{diagram ? name : `[ ${name} diagram placeholder ]`}
			</div>

			<p className="mt-3 text-justify text-sm text-(--color-text)/70">{description}</p>
		</section>
	);
}

import { DiagramViewer } from "@/components/architecture/DiagramViewer";
import { SectionHeadingWithLines } from "@/components/layout/SectionHeadings";
import type { ArchitectureDiagram } from "@/lib/architecture";

export function ArchitectureSection({
	id,
	name,
	diagramLight,
	diagramDark,
	description,
}: ArchitectureDiagram) {
	return (
		<section
			id={id}
			className="flex min-h-[calc(100dvh-5rem)] w-full flex-col justify-center py-12"
		>
			<div className="[&_h2]:text-lg">
				<SectionHeadingWithLines title={name} />
			</div>

			<DiagramViewer name={name} diagramLight={diagramLight} diagramDark={diagramDark} />

			<p className="mt-3 text-justify text-sm text-(--color-text)/70">{description}</p>
		</section>
	);
}

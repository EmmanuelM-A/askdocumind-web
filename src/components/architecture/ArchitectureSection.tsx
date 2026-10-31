import { DiagramViewer } from "@/components/architecture/DiagramViewer";
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
			className="flex min-h-[calc(100dvh-4rem)] w-full flex-col justify-center gap-5 py-12"
		>
			<h2 className="text-xl font-semibold tracking-tight text-(--color-text) sm:text-2xl">
				{name}
			</h2>

			<DiagramViewer name={name} diagramLight={diagramLight} diagramDark={diagramDark} />

			<p className="text-sm leading-relaxed text-(--color-text)/70">{description}</p>
		</section>
	);
}

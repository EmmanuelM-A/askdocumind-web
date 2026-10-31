import { ArchitectureHero } from "@/components/architecture/ArchitectureHero";
import { ArchitectureNav } from "@/components/architecture/ArchitectureNav";
import { ArchitectureSection } from "@/components/architecture/ArchitectureSection";
import { getArchitectureSections } from "@/lib/architecture";

export default function ArchitecturePage() {
	const sections = getArchitectureSections();

	return (
		<div className="mx-auto flex w-full max-w-7xl gap-12 px-4 sm:px-6">
			<ArchitectureNav />

			<div className="min-w-0 flex-1">
				<ArchitectureHero />

				{sections.map((section) => (
					<ArchitectureSection key={section.id} {...section} />
				))}
			</div>
		</div>
	);
}

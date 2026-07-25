import { ArchitectureHero } from "@/components/architecture/ArchitectureHero";
import { ArchitectureNav } from "@/components/architecture/ArchitectureNav";
import { ArchitectureSection } from "@/components/architecture/ArchitectureSection";
import { getArchitectureSections } from "@/lib/architecture";

export default function ArchitecturePage() {
	const sections = getArchitectureSections();

	return (
		<>
			<ArchitectureNav />
			<ArchitectureHero />

			<div className="mx-auto w-full max-w-5xl space-y-48 px-4 pb-[35vh] sm:px-6">
				{sections.map((section) => (
					<ArchitectureSection key={section.id} {...section} />
				))}
			</div>
		</>
	);
}

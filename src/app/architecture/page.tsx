import { ArchitectureHero } from "@/components/architecture/ArchitectureHero";
import { ArchitectureNav } from "@/components/architecture/ArchitectureNav";
import { ArchitectureSection } from "@/components/architecture/ArchitectureSection";
import { getArchitectureSections } from "@/lib/architecture";

export default function ArchitecturePage() {
	const sections = getArchitectureSections();

	return (
		<>
			<ArchitectureHero />
			<ArchitectureNav />

			<div className="mx-auto w-full max-w-5xl space-y-20 px-4 pb-20 sm:space-y-32 sm:px-6 sm:pb-32 lg:space-y-48 lg:pb-[35vh]">
				{sections.map((section) => (
					<ArchitectureSection key={section.id} {...section} />
				))}
			</div>
		</>
	);
}

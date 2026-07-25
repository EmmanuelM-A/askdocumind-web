import { ArchitectureHero } from "@/components/architecture/ArchitectureHero";
import { ArchitectureNav } from "@/components/architecture/ArchitectureNav";
import { ArchitectureSection } from "@/components/architecture/ArchitectureSection";
import architectureData from "@/data/architecture.json";

export default function ArchitecturePage() {
	return (
		<>
			<ArchitectureHero />

			<div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-10 sm:flex-row sm:px-6">
				<ArchitectureNav />

				<div className="flex min-w-0 flex-1 flex-col gap-12">
					{architectureData.sections.map((section) => (
						<ArchitectureSection key={section.id} {...section} />
					))}
				</div>
			</div>
		</>
	);
}

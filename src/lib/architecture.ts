import architectureData from "@/data/architecture.json";

export interface ArchitectureDiagram {
	id: string;
	number: number;
	name: string;
	diagram: string | null;
	description: string;
}

export function getArchitectureSections(): ArchitectureDiagram[] {
	return architectureData.sections.map((section, index) => ({
		...section,
		id: section.name.toLowerCase().split(" ").join("-"),
		number: index + 1,
	}));
}

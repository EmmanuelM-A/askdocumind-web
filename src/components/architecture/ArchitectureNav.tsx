import architectureData from "@/data/architecture.json";

export function ArchitectureNav() {
	return (
		<nav
			aria-label="Architecture diagrams"
			className="flex shrink-0 flex-row gap-2 overflow-x-auto rounded-2xl border border-(--color-tertiary) bg-(--color-secondary) p-2 sm:sticky sm:top-24 sm:h-fit sm:w-14 sm:flex-col sm:items-center sm:gap-3 sm:overflow-visible sm:py-4"
		>
			{architectureData.sections.map((section) => (
				<a
					key={section.id}
					href={`#${section.id}`}
					title={section.name}
					className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-(--color-tertiary) bg-(--color-primary) text-sm font-semibold text-(--color-text)/70 transition hover:border-(--color-accent) hover:text-(--color-accent)"
				>
					{section.number}
				</a>
			))}
		</nav>
	);
}

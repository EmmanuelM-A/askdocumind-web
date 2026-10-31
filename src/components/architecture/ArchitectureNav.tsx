"use client";

import { useEffect, useRef, useState } from "react";
import { getArchitectureSections } from "@/lib/architecture";

const navItems = [{ id: "introduction", name: "Introduction" }, ...getArchitectureSections()];

const ACTIVE_VISIBILITY = 0.75;

export function ArchitectureNav() {
	const [activeIndex, setActiveIndex] = useState(0);
	const [diamondTop, setDiamondTop] = useState(0);
	const listRef = useRef<HTMLUListElement | null>(null);
	const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
	const suppressObserverRef = useRef(false);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (suppressObserverRef.current) return;

				for (const entry of entries) {
					if (entry.intersectionRatio < ACTIVE_VISIBILITY) continue;

					const index = navItems.findIndex((item) => item.id === entry.target.id);
					if (index !== -1) setActiveIndex(index);
				}
			},
			{ threshold: ACTIVE_VISIBILITY },
		);

		for (const item of navItems) {
			const element = document.getElementById(item.id);
			if (element) observer.observe(element);
		}

		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		const updatePosition = () => {
			const item = itemRefs.current[activeIndex];
			const list = listRef.current;
			if (!item || !list) return;

			const itemRect = item.getBoundingClientRect();
			const listRect = list.getBoundingClientRect();
			setDiamondTop(itemRect.top - listRect.top + itemRect.height / 2);
		};

		updatePosition();
		window.addEventListener("resize", updatePosition);
		return () => window.removeEventListener("resize", updatePosition);
	}, [activeIndex]);

	const handleNavClick = (id: string, index: number) => (event: React.MouseEvent) => {
		event.preventDefault();
		setActiveIndex(index);

		// Otherwise the observer fires for every section scrolled past on the way,
		// dragging the diamond through each one before it settles.
		suppressObserverRef.current = true;
		const scrollEl = document.getElementById("page-scroll");
		const resume = () => {
			suppressObserverRef.current = false;
			scrollEl?.removeEventListener("scrollend", resume);
		};
		scrollEl?.addEventListener("scrollend", resume);
		window.setTimeout(resume, 1000);

		if (id === "introduction") {
			scrollEl?.scrollTo({ top: 0, behavior: "smooth" });
			return;
		}

		document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" });
	};

	return (
		<aside className="hidden w-48 shrink-0 lg:block">
			<nav
				aria-label="Architecture diagrams"
				className="sticky top-1/2 flex -translate-y-1/2 items-stretch gap-4"
			>
				<ul ref={listRef} className="flex flex-1 flex-col gap-4 text-sm">
					{navItems.map((item, index) => (
						<li
							key={item.id}
							ref={(element) => {
								itemRefs.current[index] = element;
							}}
						>
							<a
								href={`#${item.id}`}
								onClick={handleNavClick(item.id, index)}
								className={
									index === activeIndex
										? "font-semibold text-(--color-text)"
										: "text-(--color-text)/40 transition hover:text-(--color-text)/70"
								}
							>
								{item.name}
							</a>
						</li>
					))}
				</ul>

				<div className="relative w-px self-stretch bg-(--color-tertiary)">
					<span
						aria-hidden="true"
						className="absolute left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-(--color-accent) transition-[top] duration-300"
						style={{ top: `${diamondTop}px` }}
					/>
				</div>
			</nav>
		</aside>
	);
}

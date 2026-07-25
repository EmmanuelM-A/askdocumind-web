"use client";

import { useEffect, useRef, useState } from "react";
import { getArchitectureSections } from "@/lib/architecture";

const navItems = [{ id: "introduction", name: "Introduction" }, ...getArchitectureSections()];

// How far from the top of the viewport a section must cross before it's considered active.
const ACTIVE_LINE_PX = 140;

export function ArchitectureNav() {
	const [activeIndex, setActiveIndex] = useState(0);
	const [diamondTop, setDiamondTop] = useState(0);
	const listRef = useRef<HTMLUListElement | null>(null);
	const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

	useEffect(() => {
		const scrollContainer = document.getElementById("page-scroll");
		if (!scrollContainer) return;

		const updateActiveSection = () => {
			let currentIndex = 0;

			for (let index = 0; index < navItems.length; index++) {
				const element = document.getElementById(navItems[index].id);
				if (element && element.getBoundingClientRect().top <= ACTIVE_LINE_PX) {
					currentIndex = index;
				}
			}

			setActiveIndex(currentIndex);
		};

		updateActiveSection();
		scrollContainer.addEventListener("scroll", updateActiveSection, { passive: true });
		window.addEventListener("resize", updateActiveSection);

		return () => {
			scrollContainer.removeEventListener("scroll", updateActiveSection);
			window.removeEventListener("resize", updateActiveSection);
		};
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

	return (
		<nav
			aria-label="Architecture diagrams"
			className="fixed top-1/2 left-1/2 z-40 hidden items-stretch gap-4 sm:flex"
			style={{ transform: "translate(calc(-100% - 2rem - 32rem), -50%)" }}
		>
			<ul ref={listRef} className="flex w-48 flex-col gap-4 text-sm">
				{navItems.map((item, index) => (
					<li
						key={item.id}
						ref={(element) => {
							itemRefs.current[index] = element;
						}}
					>
						<a
							href={`#${item.id}`}
							onClick={(event) => {
								if (item.id !== "introduction") return;

								event.preventDefault();
								setActiveIndex(0);
								document
									.getElementById("page-scroll")
									?.scrollTo({ top: 0, behavior: "smooth" });
							}}
							className={
								index === activeIndex
									? "font-semibold whitespace-nowrap text-(--color-text)"
									: "whitespace-nowrap text-(--color-text)/40 transition hover:text-(--color-text)/70"
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
					className="absolute left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-(--color-accent) transition-[top]"
					style={{ top: `${diamondTop}px` }}
				/>
			</div>
		</nav>
	);
}

"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { getArchitectureSections } from "@/lib/architecture";

const navItems = [{ id: "introduction", name: "Introduction" }, ...getArchitectureSections()];

export function ArchitectureNav() {
	const [activeIndex, setActiveIndex] = useState(0);
	const [diamondTop, setDiamondTop] = useState(0);
	const [mounted, setMounted] = useState(false);
	const [railTop, setRailTop] = useState("50%");
	const listRef = useRef<HTMLUListElement | null>(null);
	const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		const scrollEl = document.getElementById("page-scroll");
		const lastId = navItems[navItems.length - 1].id;
		if (!scrollEl) return;

		const updateRailTop = () => {
			const lastSection = document.getElementById(lastId);
			if (!lastSection) return;

			const rect = lastSection.getBoundingClientRect();
			const viewportCenter = window.innerHeight / 2;

			// Once the last diagram's section has scrolled past the viewport's
			// vertical center, stop tracking the viewport and instead track the
			// section itself, so the rail stays beside it instead of drifting
			// down into the padding/footer below.
			setRailTop(rect.bottom > viewportCenter ? "50%" : `${rect.top + rect.height / 2}px`);
		};

		updateRailTop();
		scrollEl.addEventListener("scroll", updateRailTop, { passive: true });
		window.addEventListener("resize", updateRailTop);
		return () => {
			scrollEl.removeEventListener("scroll", updateRailTop);
			window.removeEventListener("resize", updateRailTop);
		};
	}, []);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.intersectionRatio <= 0.5) continue;

					const index = navItems.findIndex((item) => item.id === entry.target.id);
					if (index !== -1) setActiveIndex(index);
				}
			},
			{ threshold: 0.5 },
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

	const handleIntroductionClick = (id: string) => (event: React.MouseEvent) => {
		if (id !== "introduction") return;

		event.preventDefault();
		setActiveIndex(0);
		document.getElementById("page-scroll")?.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<>
			{mounted &&
				createPortal(
					<nav
						aria-label="Architecture diagrams"
						className="fixed left-1/2 z-40 hidden items-stretch gap-4 min-[1400px]:flex"
						style={{
							top: railTop,
							transform: "translate(calc(-100% - 2rem - 32rem), -50%)",
						}}
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
										onClick={handleIntroductionClick(item.id)}
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
					</nav>,
					document.body,
				)}
		</>
	);
}

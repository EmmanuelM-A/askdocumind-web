"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { getArchitectureSections } from "@/lib/architecture";

const navItems = [{ id: "introduction", name: "Introduction" }, ...getArchitectureSections()];

export function ArchitectureNav() {
	const [activeIndex, setActiveIndex] = useState(0);
	const [diamondTop, setDiamondTop] = useState(0);
	const [mounted, setMounted] = useState(false);
	const listRef = useRef<HTMLUListElement | null>(null);
	const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

	useEffect(() => {
		setMounted(true);
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

	if (!mounted) return null;

	return createPortal(
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
		</nav>,
		document.body,
	);
}

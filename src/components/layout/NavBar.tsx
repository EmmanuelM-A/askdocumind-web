"use client";

import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import headerData from "@/data/header.json";
import { useTheme } from "@/hooks/useTheme";

export function NavBar() {
	const pathname = usePathname();
	const { theme, toggleTheme } = useTheme();

	return (
		<header className="sticky top-0 z-50 flex justify-center px-4 pt-4">
			<div className="flex w-full max-w-5xl items-center justify-between gap-3 rounded-full border border-(--color-tertiary) bg-(--color-primary)/85 px-3 py-2 shadow-sm backdrop-blur">
				<Link href={headerData.logo.link} className="flex shrink-0 items-center gap-2 pl-1">
					<Image
						src="/assets/logo.svg"
						alt={headerData.logo.label}
						width={40}
						height={40}
					/>
					<span className="hidden text-base font-semibold tracking-tight text-(--color-text) sm:inline">
						{headerData.logo.label}
					</span>
				</Link>

				<nav
					aria-label="Primary"
					className="flex items-center gap-1 overflow-x-auto sm:gap-4"
				>
					{headerData.navItems.map((item) => {
						const isExternal = item.link.startsWith("http");
						const isActive = !isExternal && pathname === item.link;
						const linkClassName = `whitespace-nowrap rounded-full px-2 py-1 text-sm font-medium transition sm:px-3 ${
							isActive
								? "text-(--color-accent)"
								: "text-(--color-text)/80 hover:text-(--color-accent)"
						}`;

						return isExternal ? (
							<a
								key={item.label}
								href={item.link}
								target="_blank"
								rel="noopener noreferrer"
								className={linkClassName}
							>
								{item.label}
							</a>
						) : (
							<Link key={item.label} href={item.link} className={linkClassName}>
								{item.label}
							</Link>
						);
					})}
				</nav>

				<button
					type="button"
					onClick={toggleTheme}
					aria-label="Toggle theme"
					aria-pressed={theme === "dark"}
					className="relative flex h-8 w-16 shrink-0 items-center rounded-full border border-(--color-tertiary) bg-(--color-secondary) transition-colors"
				>
					<span className="absolute left-2 flex items-center text-(--color-text)/50">
						<FontAwesomeIcon icon={faSun} className="h-3.5 w-3.5" />
					</span>
					<span className="absolute right-2 flex items-center text-(--color-text)/50">
						<FontAwesomeIcon icon={faMoon} className="h-3.5 w-3.5" />
					</span>
					<span
						className={`absolute left-1 h-6 w-6 rounded-full shadow-sm transition-transform ${
							theme === "dark"
								? "translate-x-0 bg-white"
								: "translate-x-8 bg-(--color-accent)"
						}`}
					/>
				</button>
			</div>
		</header>
	);
}

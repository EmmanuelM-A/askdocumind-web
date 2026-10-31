"use client";

import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import headerData from "@/data/layout/header.json";
import { useTheme } from "@/hooks/useTheme";

export function NavBar() {
	const pathname = usePathname();
	const { theme, toggleTheme } = useTheme();

	return (
		<header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
			<div className="flex w-full max-w-6xl items-center justify-between gap-3 rounded-full border border-(--color-tertiary) bg-(--color-secondary)/70 px-3 py-2 shadow-(--card-shadow) backdrop-blur-xl">
				<Link
					href={headerData.logo.link}
					className="hidden shrink-0 items-center gap-2 pl-1 min-[450px]:flex"
				>
					<Image
						src="/assets/logo.svg"
						alt={headerData.logo.label}
						width={40}
						height={40}
					/>
					<span className="hidden text-base font-semibold tracking-tight text-(--color-text) min-[800px]:inline">
						{headerData.logo.label}
					</span>
				</Link>

				<nav aria-label="Primary" className="flex shrink-0 items-center gap-4">
					{headerData.navItems.map((item) => {
						const isExternal = item.link.startsWith("http");
						const isActive = !isExternal && pathname === item.link;
						const linkClassName = `group relative flex items-center whitespace-nowrap rounded-full px-2 py-1 text-sm font-medium transition min-[800px]:px-3 ${
							isActive
								? "bg-(--color-accent)/10 text-(--color-accent)"
								: "text-(--color-text)/70 hover:text-(--color-text)"
						}`;
						const content = (
							<>
								<span
									aria-hidden="true"
									className="block h-5.5 w-5.5 bg-current min-[800px]:hidden"
									style={{
										maskImage: `url(${item.icon})`,
										maskSize: "contain",
										maskRepeat: "no-repeat",
										maskPosition: "center",
										WebkitMaskImage: `url(${item.icon})`,
										WebkitMaskSize: "contain",
										WebkitMaskRepeat: "no-repeat",
										WebkitMaskPosition: "center",
									}}
								/>
								<span className="hidden min-[800px]:inline">{item.label}</span>
								<span className="pointer-events-none absolute top-full left-1/2 mt-2 -translate-x-1/2 rounded-md bg-(--color-text) px-2 py-1 text-xs whitespace-nowrap text-(--color-primary) opacity-0 transition group-hover:opacity-100 min-[800px]:hidden">
									{item.label}
								</span>
							</>
						);

						return isExternal ? (
							<a
								key={item.label}
								href={item.link}
								target="_blank"
								rel="noopener noreferrer"
								className={linkClassName}
							>
								{content}
							</a>
						) : (
							<Link key={item.label} href={item.link} className={linkClassName}>
								{content}
							</Link>
						);
					})}
				</nav>

				<button
					type="button"
					onClick={toggleTheme}
					aria-label="Toggle theme"
					aria-pressed={theme === "dark"}
					className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-(--color-tertiary) bg-(--color-secondary) text-(--color-text) transition-colors min-[450px]:hidden"
				>
					<FontAwesomeIcon icon={theme === "dark" ? faSun : faMoon} className="h-4 w-4" />
				</button>

				<button
					type="button"
					onClick={toggleTheme}
					aria-label="Toggle theme"
					aria-pressed={theme === "dark"}
					className="relative hidden h-8 w-16 shrink-0 items-center rounded-full border border-(--color-tertiary) bg-(--color-secondary) transition-colors min-[450px]:flex"
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
								: "bg-(--color-accent-strong) translate-x-8"
						}`}
					/>
				</button>
			</div>
		</header>
	);
}

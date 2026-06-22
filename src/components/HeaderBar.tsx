import type { ReactNode } from "react";
import logoIcon from "@/assets/icons/logo.svg";
import githubIcon from "@/assets/icons/github-icon.svg";
import headerData from "@/data/header.json";

const navIconMap: Record<string, string> = {
	GitHub: githubIcon,
};

interface HeaderBarProps {
	theme: "light" | "dark";
	onThemeToggle: () => void;
}

function IconTheme({ theme }: { theme: "light" | "dark" }) {
	if (theme === "dark") {
		return (
			<svg
				aria-hidden="true"
				viewBox="0 0 24 24"
				className="h-5 w-5"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.8"
			>
				<path d="M21 12.8A8.8 8.8 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" />
			</svg>
		);
	}

	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 24 24"
			className="h-5 w-5"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
		>
			<circle cx="12" cy="12" r="4" />
			<path d="M12 2v2.4M12 19.6V22M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M2 12h2.4M19.6 12H22M4.9 19.1l1.7-1.7M17.4 6.6l1.7-1.7" />
		</svg>
	);
}

function NavButton({
	label,
	icon,
	onClick,
}: {
	label: string;
	icon: ReactNode;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="inline-flex items-center justify-center gap-2 rounded-md px-2 py-1.5 text-3xl font-medium text-[var(--color-text)] transition hover:text-[var(--color-accent)] sm:px-4"
		>
			<span className="sm:hidden" aria-hidden="true">
				{icon}
			</span>
			<span className="hidden sm:inline">{label}</span>
		</button>
	);
}

export function HeaderBar({ theme, onThemeToggle }: HeaderBarProps) {
	return (
		<header className="border-b border-[var(--color-tertiary)] bg-[var(--color-primary)]/85 backdrop-blur">
			<div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
				<div className="flex items-center gap-4 text-3xl font-semibold tracking-[0.08em] text-[var(--color-text)]">
					<img
						src={logoIcon}
						alt={headerData.logo.alt}
						className="h-[84px] w-[84px] shrink-0 sm:h-[72px] sm:w-[72px]"
						style={{ minWidth: headerData.logo.minWidth }}
					/>
					<span className="hidden sm:inline">{headerData.appName || "LOGO"}</span>
				</div>

				<nav className="flex items-center gap-2" aria-label="Top navigation">
					{headerData.navItems.map((item) => (
						<a
							key={item.name}
							href={item.link}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center justify-center gap-2 rounded-md px-2 py-1.5 text-3xl font-medium text-[var(--color-text)] transition hover:text-[var(--color-accent)] sm:px-4"
						>
							{navIconMap[item.name] && <img src={navIconMap[item.name]} alt={item.name} className="h-5 w-5 sm:hidden" />}
							<span className="hidden sm:inline">{item.name}</span>
						</a>
					))}
					<NavButton
						label="Theme"
						icon={<IconTheme theme={theme} />}
						onClick={onThemeToggle}
					/>
				</nav>
			</div>
		</header>
	);
}

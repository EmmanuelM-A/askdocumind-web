import type { ReactNode } from "react";
import headerData from "@/data/header.json";

interface HeaderBarProps {
    theme: "light" | "dark";
    onThemeToggle: () => void;
    onHomeClick: () => void;
    onGithubClick: () => void;
    onHelpClick: () => void;
}

function IconHome() {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 sm:h-5 sm:w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M3 11.5 12 4l9 7.5" />
            <path d="M6.5 10.5V20h11V10.5" />
        </svg>
    );
}

function IconGithub() {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 sm:h-5 sm:w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M9 18c-4 1.2-4-2-6-2" />
            <path d="M15 22v-3.1c0-1 .1-1.7-.4-2.2 2.8-.3 5.7-1.4 5.7-6.2 0-1.4-.5-2.5-1.3-3.3.1-.3.6-1.6-.1-3.3 0 0-1.1-.3-3.6 1.3a12.6 12.6 0 0 0-6.6 0C6.2 3.6 5.1 4 5.1 4c-.7 1.7-.2 3-.1 3.3-.8.8-1.3 1.9-1.3 3.3 0 4.8 2.9 5.9 5.7 6.2-.5.5-.5 1.1-.5 2.2V22" />
        </svg>
    );
}

function IconHelp() {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 sm:h-5 sm:w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="9" />
            <path d="M9.6 9.2a2.8 2.8 0 1 1 4.8 2c-.9.8-1.8 1.2-1.8 2.8" />
            <circle cx="12" cy="17" r=".9" fill="currentColor" stroke="none" />
        </svg>
    );
}

function IconTheme({ theme }: { theme: "light" | "dark" }) {
    if (theme === "dark") {
        return (
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M21 12.8A8.8 8.8 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" />
            </svg>
        );
    }

    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
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
            className="inline-flex items-center justify-center gap-2 rounded-md px-2 py-1.5 text-base font-medium text-[var(--color-text)] transition hover:text-[var(--color-accent)] sm:px-4 sm:text-sm"
        >
            <span className="sm:hidden" aria-hidden="true">
                {icon}
            </span>
            <span className="hidden sm:inline">{label}</span>
        </button>
    );
}

export function HeaderBar({
    theme,
    onThemeToggle,
    onHomeClick,
    onGithubClick,
    onHelpClick,
}: HeaderBarProps) {
    return (
        <header className="border-b border-[var(--color-tertiary)] bg-[var(--color-primary)]/85 backdrop-blur">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
                <button
                    type="button"
                    onClick={() => console.log("Logo clicked")}
                    className="flex items-center gap-2 text-base font-semibold tracking-[0.15em] text-[var(--color-text)] sm:text-sm"
                >
                    <img src={headerData.logo.src} alt={headerData.logo.alt} className="h-6 w-6 sm:h-5 sm:w-5" />
                    <span className="hidden sm:inline">{headerData.appName || "LOGO"}</span>
                </button>

                <nav className="flex items-center gap-2" aria-label="Top navigation">
                    <NavButton label={headerData.navItems[0]?.name || "HOME"} icon={<IconHome />} onClick={onHomeClick} />
                    <NavButton label={headerData.navItems[1]?.name || "GITHUB"} icon={<IconGithub />} onClick={onGithubClick} />
                    <NavButton label={headerData.navItems[2]?.name || "HELP"} icon={<IconHelp />} onClick={onHelpClick} />
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



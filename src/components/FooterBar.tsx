import footerData from "@/data/footer.json";

export function FooterBar() {
    return (
        <footer className="border-t border-[var(--color-tertiary)] bg-[var(--color-primary)]/85 py-3">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
                <div className="flex flex-col items-center justify-center gap-2 py-2 sm:flex-row sm:justify-between sm:gap-4">
                    <div className="flex items-baseline gap-2">
                        <p className="text-sm font-semibold text-[var(--color-text)]">{footerData.appName}</p>
                        <p className="text-xs text-[var(--color-text)]/60">{footerData.version}</p>
                    </div>

                    <p className="order-2 text-xs text-[var(--color-text)]/70 sm:order-none">{footerData.description}</p>

                    <nav className="flex items-center gap-4 text-xs">
                        {footerData.links.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-[var(--color-text)]/75 transition hover:text-[var(--color-accent)]"
                            >
                                {link.name}
                            </a>
                        ))}
                    </nav>
                </div>
            </div>
        </footer>
    );
}


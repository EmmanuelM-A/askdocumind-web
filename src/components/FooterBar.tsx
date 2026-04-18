import footerData from "@/data/footer.json";

export function FooterBar() {
    return (
        <footer className="border-t border-[var(--color-tertiary)] bg-[var(--color-primary)]/85 py-3">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
                <div className="grid gap-2 py-2 sm:grid-cols-3 sm:items-center sm:gap-4">
                    <div className="flex items-baseline gap-2">
                        <p className="text-sm font-semibold text-[var(--color-text)]">{footerData.appName}</p>
                        <p className="text-xs text-[var(--color-text)]/60">{footerData.version}</p>
                    </div>

                    <p className="text-center text-xs text-[var(--color-text)]/70">{footerData.description}</p>

                    <div aria-hidden="true" />
                </div>
            </div>
        </footer>
    );
}


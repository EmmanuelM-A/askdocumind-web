export function FooterBar() {
    return (
        <footer className="border-t border-[var(--color-tertiary)] bg-[var(--color-primary)]/85 py-3">
            <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-1 px-4 text-center text-xs text-[var(--color-text)] sm:flex-row sm:px-6 sm:text-left">
                <p className="font-medium">DocuChat Frontend</p>
                <p className="text-[var(--color-text)]/75">Prototype UI | No auth mode | Version v0.1.0</p>
            </div>
        </footer>
    );
}


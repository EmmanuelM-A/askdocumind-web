import { useState } from "react";

interface ChatAreaProps {
    chatSessionId: string | null;
    isChatSessionLoading: boolean;
}

export function ChatArea({ chatSessionId, isChatSessionLoading }: ChatAreaProps) {
    const [draft, setDraft] = useState("");

    return (
        <section className="flex h-full min-h-[22rem] flex-col rounded-[2rem] border border-[var(--color-tertiary)] bg-[var(--color-secondary)] p-4 shadow-sm sm:min-h-[26rem] sm:p-6">

            <div className="flex-1 rounded-2xl border border-[var(--color-tertiary)] bg-[var(--color-primary)] p-4 text-sm text-[var(--color-text)]/80">
                <p className="mb-2 font-medium text-[var(--color-text)]">Welcome to DocuChat.</p>
                <p className="mt-3 text-xs text-[var(--color-text)]/60">
                    {isChatSessionLoading
                        ? "Creating your chat session..."
                        : chatSessionId
                            ? "Chat session is active."
                            : "Chat session unavailable."}
                </p>
            </div>

            <form
                className="mt-4 flex items-center gap-2"
                onSubmit={(event) => {
                    event.preventDefault();
                    console.log("Send message clicked:", {
                        chatSessionId,
                        message: draft,
                    });
                    setDraft("");
                }}
            >
                <input
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="Ask a question about your uploaded docs..."
                    className="h-10 w-full rounded-xl border border-[var(--color-tertiary)] bg-[var(--color-primary)] px-3 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text)]/50 focus:border-[var(--color-accent)]"
                    disabled={isChatSessionLoading || !chatSessionId}
                />
                <button
                    type="submit"
                    className="inline-flex h-10 items-center justify-center rounded-xl bg-[var(--color-accent)] px-4 text-sm font-semibold text-white transition hover:opacity-90"
                    disabled={isChatSessionLoading || !chatSessionId}
                >
                    Send
                </button>
            </form>
        </section>
    );
}


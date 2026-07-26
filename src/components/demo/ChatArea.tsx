"use client";

import { useState } from "react";
import demoContent from "@/data/demo/content.json";

interface ChatBubble {
	id: string;
	role: "USER" | "ASSISTANT";
	content: string;
}

export function ChatArea() {
	const [draft, setDraft] = useState("");
	const [messages, setMessages] = useState<ChatBubble[]>([]);
	const [isSending, setIsSending] = useState(false);

	const handleSendMessage = async () => {
		const trimmedDraft = draft.trim();
		if (!trimmedDraft || isSending) return;

		setDraft("");
		setMessages((prev) => [
			...prev,
			{ id: `${Date.now()}-user`, role: "USER", content: trimmedDraft },
		]);
		setIsSending(true);

		// Demo only: not wired up to the real API yet.
		await new Promise((resolve) => setTimeout(resolve, 700));

		setMessages((prev) => [
			...prev,
			{
				id: `${Date.now()}-assistant`,
				role: "ASSISTANT",
				content: "This is a demo response. Connect the API to see real, grounded answers.",
			},
		]);
		setIsSending(false);
	};

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-3">
			<div className="min-h-0 flex-1 overflow-y-auto rounded-2xl border border-(--color-tertiary) bg-(--color-primary) p-4">
				{messages.length === 0 ? (
					<div className="flex h-full items-center justify-center text-center text-sm text-(--color-text)/50">
						{demoContent.chatBoxPlaceholder}
					</div>
				) : (
					<div className="space-y-3 text-sm text-(--color-text)/80">
						{messages.map((message) => (
							<div
								key={message.id}
								className={
									message.role === "USER"
										? "ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-(--color-accent) px-4 py-3 text-white"
										: "mr-auto max-w-[85%] rounded-2xl rounded-bl-md bg-(--color-secondary) px-4 py-3 text-(--color-text) shadow-sm"
								}
							>
								<p className="whitespace-pre-wrap leading-relaxed">
									{message.content}
								</p>
							</div>
						))}
						{isSending && <p className="text-xs text-(--color-text)/60">Thinking...</p>}
					</div>
				)}
			</div>

			<form
				className="flex shrink-0 items-center gap-2"
				onSubmit={(event) => {
					event.preventDefault();
					void handleSendMessage();
				}}
			>
				<input
					value={draft}
					onChange={(event) => setDraft(event.target.value)}
					placeholder={demoContent.chatBoxInputPlaceholder}
					className="h-11 w-full rounded-xl border border-(--color-tertiary) bg-(--color-primary) px-3 text-sm text-(--color-text) outline-none placeholder:text-(--color-text)/50 focus:border-(--color-accent)"
				/>
				<button
					type="submit"
					disabled={isSending || !draft.trim()}
					className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl bg-(--color-accent) px-5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
				>
					{isSending ? "Sending..." : "Send"}
				</button>
			</form>
		</div>
	);
}

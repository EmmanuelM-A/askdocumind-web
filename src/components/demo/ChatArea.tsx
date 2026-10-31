"use client";

import { faComments } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { chatWithChatbot } from "@/api/chatbot-endpoints";
import demoContent from "@/data/demo/content.json";
import type { UUID } from "@/types/api";

export interface ChatBubble {
	id: string;
	role: "USER" | "ASSISTANT";
	content: string;
	sources?: string[] | null;
}

interface ChatAreaProps {
	chatId: UUID | null;
	hasUploadedDocuments: boolean;
	webSearchEnabled: boolean;
	messages: ChatBubble[];
	onMessagesChange: (messages: ChatBubble[]) => void;
}

export function ChatArea({
	chatId,
	hasUploadedDocuments,
	webSearchEnabled,
	messages,
	onMessagesChange,
}: ChatAreaProps) {
	const [draft, setDraft] = useState("");
	const [isSending, setIsSending] = useState(false);

	const canSend = Boolean(draft.trim()) && hasUploadedDocuments && Boolean(chatId) && !isSending;

	const handleSendMessage = async () => {
		const trimmedDraft = draft.trim();
		if (!trimmedDraft || isSending || !hasUploadedDocuments || !chatId) return;

		setDraft("");
		const userMessage: ChatBubble = {
			id: `${Date.now()}-user`,
			role: "USER",
			content: trimmedDraft,
		};
		onMessagesChange([...messages, userMessage]);
		setIsSending(true);

		try {
			const response = await chatWithChatbot({
				user_query: trimmedDraft,
				chat_id: chatId,
				web_search_enabled: webSearchEnabled,
			});

			const assistantMessage: ChatBubble = {
				id: `${Date.now()}-assistant`,
				role: "ASSISTANT",
				content: response.answer,
				sources: response.sources,
			};
			onMessagesChange([...messages, userMessage, assistantMessage]);
		} catch (error) {
			console.error("Failed to send chat message", error);
		} finally {
			setIsSending(false);
		}
	};

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-3">
			<div className="min-h-0 flex-1 overflow-hidden rounded-2xl border border-(--color-tertiary) bg-(--color-primary)">
				<div className="chat-scrollbar h-full overflow-y-auto p-4">
					{messages.length === 0 ? (
						<div className="flex h-full flex-col items-center justify-center gap-3 text-center text-sm text-(--color-text)/50">
							<FontAwesomeIcon
								icon={faComments}
								className="h-8! w-8! text-(--color-accent)"
							/>
							{demoContent.chatBoxPlaceholder}
						</div>
					) : (
						<div className="space-y-3 text-sm text-(--color-text)/80">
							{messages.map((message) => (
								<div
									key={message.id}
									className={
										message.role === "USER"
											? "ml-auto max-w-[85%]"
											: "mr-auto max-w-[85%]"
									}
								>
									<div
										className={
											message.role === "USER"
												? "rounded-2xl rounded-br-md bg-(--color-accent) px-4 py-3 text-white"
												: "rounded-2xl rounded-bl-md bg-(--color-secondary) px-4 py-3 text-(--color-text) shadow-sm"
										}
									>
										<p className="whitespace-pre-wrap leading-relaxed">
											{message.content}
										</p>
									</div>

									{message.role === "ASSISTANT" &&
										message.sources &&
										message.sources.length > 0 && (
											<p className="mt-1 pl-1 text-left text-[11px] wrap-break-word text-(--color-text)/50">
												{message.sources.join(", ")}
											</p>
										)}
								</div>
							))}
							{isSending && (
								<p className="text-xs text-(--color-text)/60">Thinking...</p>
							)}
						</div>
					)}
				</div>
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
					disabled={!canSend}
					className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl bg-(--color-accent) px-5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
				>
					{isSending ? "Sending..." : "Send"}
				</button>
			</form>
		</div>
	);
}

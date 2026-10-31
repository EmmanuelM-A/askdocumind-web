"use client";

import { faComments, faFileLines, faGlobe } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type FormEvent, useState } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { getErrorMessage, isChatGone } from "@/api/api-client";
import { askChatbot } from "@/api/chatbot-endpoints";
import type { AskSettings } from "@/components/demo/ConfigPanel";
import { DEFAULT_ASK_CONFIGS, MAX_QUERY_LENGTH } from "@/config/constants";
import demoContent from "@/data/demo/content.json";
import type { UUID } from "@/types/api";
import type { AskConfigs } from "@/types/chatbot";

interface ChatMessage {
	id: string;
	role: "user" | "assistant";
	content: string;
	sources: string[];
}

interface ChatAreaProps {
	chatId: UUID | null;
	disabledHint: string | null;
	settings: AskSettings;
	documentNames: string[];
	onChatGone: () => void;
}

const markdownComponents: Components = {
	a: ({ href, children }) => (
		<a href={href} target="_blank" rel="noopener noreferrer">
			{children}
		</a>
	),
};

function getChangedConfigs(settings: AskSettings): AskConfigs | undefined {
	const changed = Object.fromEntries(
		Object.entries(settings).filter(
			([key, value]) => DEFAULT_ASK_CONFIGS[key as keyof AskSettings] !== value,
		),
	);
	return Object.keys(changed).length > 0 ? changed : undefined;
}

export function ChatArea({
	chatId,
	disabledHint,
	settings,
	documentNames,
	onChatGone,
}: ChatAreaProps) {
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [draft, setDraft] = useState("");
	const [isSending, setIsSending] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const query = draft.trim();
	const canSend =
		Boolean(chatId) &&
		!disabledHint &&
		!isSending &&
		query.length > 0 &&
		query.length <= MAX_QUERY_LENGTH;
	const lastMessage = messages.at(-1);

	async function ask(question: string) {
		if (!chatId) return;

		setError(null);
		setIsSending(true);

		try {
			const response = await askChatbot(chatId, {
				query: question,
				configs: getChangedConfigs(settings),
			});
			setMessages((prev) => [
				...prev,
				{
					id: crypto.randomUUID(),
					role: "assistant",
					content: response.answer,
					sources: response.sources,
				},
			]);
		} catch (error) {
			if (isChatGone(error)) return onChatGone();
			setError(getErrorMessage(error));
		} finally {
			setIsSending(false);
		}
	}

	function handleSubmit(event: FormEvent) {
		event.preventDefault();
		if (!canSend) return;

		setMessages((prev) => [
			...prev,
			{ id: crypto.randomUUID(), role: "user", content: query, sources: [] },
		]);
		setDraft("");
		void ask(query);
	}

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-3">
			{/* flex-col-reverse keeps the scroll pinned to the newest message without any JS. */}
			<div className="chat-scrollbar flex min-h-0 flex-1 flex-col-reverse overflow-y-auto rounded-2xl border border-(--color-tertiary) bg-(--color-primary) p-4">
				{messages.length === 0 && !isSending ? (
					<div className="flex flex-1 flex-col items-center justify-center gap-3 text-center text-sm text-(--color-text)/50">
						<FontAwesomeIcon
							icon={faComments}
							className="h-8! w-8! text-(--color-accent)"
						/>
						{demoContent.chat.emptyState}
					</div>
				) : (
					<div className="space-y-4 text-sm">
						{messages.map((message) =>
							message.role === "user" ? (
								<div
									key={message.id}
									className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-(--color-accent) px-4 py-3 whitespace-pre-wrap text-white"
								>
									{message.content}
								</div>
							) : (
								<div key={message.id} className="mr-auto max-w-[85%]">
									<div className="chat-markdown rounded-2xl rounded-bl-md bg-(--color-secondary) px-4 py-3 text-(--color-text) shadow-sm">
										<ReactMarkdown
											remarkPlugins={[remarkGfm]}
											components={markdownComponents}
										>
											{message.content}
										</ReactMarkdown>
									</div>

									{message.sources.length > 0 && (
										<ul
											className="mt-2 flex flex-wrap gap-1.5 pl-1"
											aria-label="Sources"
										>
											{message.sources.map((source) => (
												<li
													key={source}
													className="flex items-center gap-1.5 rounded-full border border-(--color-tertiary) px-2.5 py-1 text-xs text-(--color-text)/70"
												>
													<FontAwesomeIcon
														icon={
															documentNames.includes(source)
																? faFileLines
																: faGlobe
														}
														className="h-3! w-3! text-(--color-accent)"
													/>
													{source}
												</li>
											))}
										</ul>
									)}
								</div>
							),
						)}

						{isSending && (
							<p className="mr-auto animate-pulse rounded-2xl rounded-bl-md bg-(--color-secondary) px-4 py-3 text-(--color-text)/60">
								Thinking…
							</p>
						)}

						{error && (
							<div className="mr-auto flex max-w-[85%] items-center gap-3 rounded-2xl border border-red-500/40 px-4 py-3 text-red-500">
								<span>{error}</span>
								{lastMessage?.role === "user" && (
									<button
										type="button"
										onClick={() => void ask(lastMessage.content)}
										className="shrink-0 font-semibold underline underline-offset-2"
									>
										Retry
									</button>
								)}
							</div>
						)}
					</div>
				)}
			</div>

			<form className="flex shrink-0 flex-col gap-1" onSubmit={handleSubmit}>
				<div className="flex items-center gap-2">
					<input
						value={draft}
						onChange={(event) => setDraft(event.target.value)}
						maxLength={MAX_QUERY_LENGTH}
						placeholder={demoContent.chat.inputPlaceholder}
						aria-label="Question"
						className="h-11 w-full rounded-xl border border-(--color-tertiary) bg-(--color-primary) px-3 text-sm text-(--color-text) outline-none placeholder:text-(--color-text)/50 focus:border-(--color-accent)"
					/>
					<button
						type="submit"
						disabled={!canSend}
						className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl bg-(--color-accent) px-5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
					>
						{isSending ? "Sending…" : "Send"}
					</button>
				</div>

				{disabledHint && (
					<p className="pl-1 text-xs text-(--color-text)/60">{disabledHint}</p>
				)}
			</form>
		</div>
	);
}

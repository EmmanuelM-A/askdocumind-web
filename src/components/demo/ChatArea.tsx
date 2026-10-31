"use client";

import {
	faArrowUp,
	faFileLines,
	faGlobe,
	faSpinner,
	faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";
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
		<div className="flex min-h-0 flex-1 flex-col">
			{/* flex-col-reverse keeps the scroll pinned to the newest message without any JS. */}
			<div className="chat-scrollbar flex min-h-0 flex-1 flex-col-reverse overflow-y-auto px-4 py-6 sm:px-6">
				{messages.length === 0 && !isSending ? (
					<div className="m-auto flex max-w-sm flex-col items-center gap-3 text-center">
						<Avatar size="lg" />
						<p className="font-semibold text-(--color-text)">
							{demoContent.chat.emptyTitle}
						</p>
						<p className="text-sm text-(--color-text)/55">
							{demoContent.chat.emptyState}
						</p>
					</div>
				) : (
					<div className="space-y-6 text-sm">
						{messages.map((message) =>
							message.role === "user" ? (
								<div
									key={message.id}
									className="bg-(--color-accent-strong) ml-auto w-fit max-w-[80%] rounded-2xl rounded-br-md px-4 py-2.5 whitespace-pre-wrap text-white shadow-sm"
								>
									{message.content}
								</div>
							) : (
								<div key={message.id} className="flex max-w-[90%] gap-3">
									<Avatar />
									<div className="min-w-0 flex-1 pt-0.5">
										<div className="chat-markdown text-(--color-text)/90">
											<ReactMarkdown
												remarkPlugins={[remarkGfm]}
												components={markdownComponents}
											>
												{message.content}
											</ReactMarkdown>
										</div>

										{message.sources.length > 0 && (
											<div className="mt-3">
												<p className="mb-1.5 text-[11px] font-medium tracking-wide text-(--color-text)/45 uppercase">
													Sources
												</p>
												<ul className="flex flex-wrap gap-1.5">
													{message.sources.map((source) => (
														<li
															key={source}
															className="flex items-center gap-1.5 rounded-full border border-(--color-tertiary) bg-(--color-primary) px-2.5 py-1 text-xs text-(--color-text)/75"
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
											</div>
										)}
									</div>
								</div>
							),
						)}

						{isSending && (
							<div className="flex items-center gap-3">
								<Avatar />
								<output className="flex gap-1" aria-label="Thinking">
									{[0, 150, 300].map((delay) => (
										<span
											key={delay}
											className="h-1.5 w-1.5 animate-[typing-dot_1.2s_ease-in-out_infinite] rounded-full bg-(--color-text)/60"
											style={{ animationDelay: `${delay}ms` }}
										/>
									))}
								</output>
							</div>
						)}

						{error && (
							<div className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-red-500">
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

			<form
				className="shrink-0 border-t border-(--color-tertiary) px-4 py-3"
				onSubmit={handleSubmit}
			>
				<div className="flex items-center gap-2 rounded-xl border border-(--color-tertiary) bg-(--color-primary) py-1.5 pr-1.5 pl-4 transition focus-within:border-(--color-accent)/60 focus-within:ring-4 focus-within:ring-(--color-accent)/10">
					<input
						value={draft}
						onChange={(event) => setDraft(event.target.value)}
						maxLength={MAX_QUERY_LENGTH}
						placeholder={disabledHint ?? demoContent.chat.inputPlaceholder}
						aria-label="Question"
						className="h-9 w-full bg-transparent text-sm text-(--color-text) outline-none placeholder:text-(--color-text)/40"
					/>
					<button
						type="submit"
						disabled={!canSend}
						aria-label={isSending ? "Sending" : "Send"}
						className="bg-(--color-accent-strong) flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white shadow-sm transition hover:opacity-90 disabled:opacity-35"
					>
						<FontAwesomeIcon
							icon={isSending ? faSpinner : faArrowUp}
							spin={isSending}
							className="h-3.5! w-3.5!"
						/>
					</button>
				</div>
			</form>
		</div>
	);
}

function Avatar({ size = "sm" }: { size?: "sm" | "lg" }) {
	return (
		<span
			className={`bg-(--color-accent-strong) flex shrink-0 items-center justify-center text-white shadow-sm ${
				size === "lg" ? "h-12 w-12 rounded-2xl" : "h-7 w-7 rounded-full"
			}`}
		>
			<FontAwesomeIcon
				icon={faWandMagicSparkles}
				className={size === "lg" ? "h-5! w-5!" : "h-3! w-3!"}
			/>
		</span>
	);
}

import { useEffect, useRef, useState } from "react";
import { getChatSessionMessages } from "@/api/chat-session-endpoints.ts";
import { chatWithChatbot } from "@/api/chatbot-endpoints.ts";
import { settings } from "@/config/configs.ts";
import { logger } from "@/lib/logger.ts";
import type { UUID } from "@/types/api.ts";
import type { ChatMessage } from "@/types/chat-messages.ts";
import type { ChatbotResponse } from "@/types/chatbot.ts";

interface ChatAreaProps {
	chatSessionId: UUID | null;
	isChatSessionLoading: boolean;
}

type ChatBubbleRole = "USER" | "ASSISTANT" | "SYSTEM" | "ERROR";

interface ChatBubble {
	id: string;
	role: ChatBubbleRole;
	content: string;
	sources?: string[];
}

export function ChatArea({ chatSessionId, isChatSessionLoading }: ChatAreaProps) {
	const [draft, setDraft] = useState("");
	const [messages, setMessages] = useState<ChatBubble[]>([
		{
			id: "welcome",
			role: "SYSTEM",
			content: "Ask a question about your uploaded docs to start chatting.",
		},
	]);
	const [isSending, setIsSending] = useState(false);
	const messageListRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (messages.length > 0) {
			messageListRef.current?.scrollTo({
				top: messageListRef.current.scrollHeight,
				behavior: "smooth",
			});
		}
	}, [messages]);

	useEffect(() => {
		let isMounted = true;

		const loadChatHistory = async () => {
			if (!chatSessionId || isChatSessionLoading) return;

			try {
				const chatHistory = await getChatSessionMessages(chatSessionId);

				if (!isMounted) return;

				if (!chatHistory.length) {
					setMessages([
						{
							id: "welcome",
							role: "SYSTEM",
							content: "Ask a question about your uploaded docs to start chatting.",
						},
					]);
					return;
				}

				const sortedHistory = [...chatHistory].sort(
					(left, right) =>
						new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime(),
				);

				setMessages(
					sortedHistory.map((message: ChatMessage) => ({
						id: message.id,
						role: message.role,
						content: message.content,
					})),
				);
			} catch (error) {
				logger.error("Failed to load chat history:", error);
				if (!isMounted) return;

				setMessages([
					{
						id: "history-error",
						role: "SYSTEM",
						content:
							"Could not load previous messages. You can still continue the chat below.",
					},
				]);
			}
		};

		void loadChatHistory();

		return () => {
			isMounted = false;
		};
	}, [chatSessionId, isChatSessionLoading]);

	const formatChatbotResponse = (response: ChatbotResponse): string => {
		const trimmedAnswer = response.answer.trim();
		return trimmedAnswer || "I couldn't generate a response for that question.";
	};

	const handleSendMessage = async () => {
		const trimmedDraft = draft.trim();

		if (!trimmedDraft || !chatSessionId || isSending) return;

		const userMessage: ChatBubble = {
			id: `${Date.now()}-user`,
			role: "USER",
			content: trimmedDraft,
		};

		setDraft("");
		setMessages((prev) => [...prev, userMessage]);
		setIsSending(true);

		try {
			const response = await chatWithChatbot({
				user_query: trimmedDraft,
				chat_id: chatSessionId,
				web_search_enabled: settings.api.IS_WEB_SEARCH_ENABLED,
			});

			setMessages((prev) => [
				...prev,
				{
					id: `${Date.now()}-assistant`,
					role: "ASSISTANT",
					content: formatChatbotResponse(response),
					sources: response.sources ?? [],
				},
			]);
		} catch (error) {
			logger.error("Failed to send chat message:", error);
			setMessages((prev) => [
				...prev,
				{
					id: `${Date.now()}-system-error`,
					role: "ERROR",
					content: "Sorry, something went wrong while sending your message.",
				},
			]);
		} finally {
			setIsSending(false);
		}
	};

	const bubbleClasses: Record<ChatBubbleRole, string> = {
		USER: "ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-[var(--color-accent)] px-4 py-3 text-white",
		ASSISTANT:
			"mr-auto max-w-[85%] rounded-2xl rounded-bl-md bg-[var(--color-secondary)] px-4 py-3 text-[var(--color-text)] shadow-sm",
		SYSTEM: "mx-auto max-w-[90%] rounded-2xl bg-[var(--color-primary)] px-4 py-2 text-center text-[var(--text-xs)] text-[var(--color-text)]/70",
		ERROR: "mx-auto max-w-[90%] rounded-2xl border border-red-400 bg-red-50 px-4 py-3 text-center text-[var(--text-xs)] text-red-600",
	};

	return (
		<section className="flex h-full w-full flex-col overflow-hidden rounded-[2rem] border border-[var(--color-tertiary)] bg-[var(--color-secondary)] p-4 shadow-sm sm:p-6">
			<div
				ref={messageListRef}
				className="min-h-0 flex-1 overflow-y-auto space-y-3 rounded-2xl border border-[var(--color-tertiary)] bg-[var(--color-primary)] p-4 text-[var(--text-sm)] text-[var(--color-text)]/80"
			>
				{messages.map((message) => (
					<div key={message.id} className="flex flex-col">
						<div className={bubbleClasses[message.role]}>
							<p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
						</div>
						{message.role === "ASSISTANT" &&
							message.sources &&
							message.sources.length > 0 && (
								<p className="mt-1 mr-auto text-right text-[var(--text-xs)] text-[var(--color-text)]/40">
									{message.sources.join(", ")}
								</p>
							)}
					</div>
				))}

				<p className="pt-1 text-[var(--text-xs)] text-[var(--color-text)]/60">
					{isChatSessionLoading
						? "Creating your chat session..."
						: chatSessionId
							? isSending
								? "Thinking..."
								: "Chat session is active."
							: "Chat session unavailable."}
				</p>
			</div>

			<form
				className="mt-4 flex items-center gap-2"
				onSubmit={async (event) => {
					event.preventDefault();
					await handleSendMessage();
				}}
			>
				<input
					value={draft}
					onChange={(event) => setDraft(event.target.value)}
					placeholder="Ask a question about your uploaded docs..."
					className="h-10 w-full rounded-xl border border-[var(--color-tertiary)] bg-[var(--color-primary)] px-3 text-[var(--text-sm)] text-[var(--color-text)] outline-none placeholder:text-[var(--color-text)]/50 focus:border-[var(--color-accent)]"
					disabled={isChatSessionLoading || !chatSessionId || isSending}
				/>
				<button
					type="submit"
					className="inline-flex h-10 items-center justify-center rounded-xl bg-[var(--color-accent)] px-4 text-[var(--text-sm)] font-semibold text-white transition hover:opacity-90"
					disabled={isChatSessionLoading || !chatSessionId || isSending}
				>
					{isSending ? (
						<span className="inline-flex items-center gap-1.5">
							<span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
							Sending...
						</span>
					) : "Send"}
				</button>
			</form>
		</section>
	);
}

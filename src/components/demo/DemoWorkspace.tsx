"use client";

import { faFolderOpen, faSliders, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useState } from "react";
import { initAnonymousSession } from "@/api/auth-endpoints";
import { deleteChatSession, initChatSession } from "@/api/chat-session-endpoints";
import { ChatArea } from "@/components/demo/ChatArea";
import { type AskSettings, ConfigPanel } from "@/components/demo/ConfigPanel";
import { DocumentsPanel } from "@/components/demo/DocumentsPanel";
import { DEFAULT_ASK_CONFIGS, UPLOAD_LIMITS } from "@/config/constants";
import demoContent from "@/data/demo/content.json";
import { useDocuments } from "@/hooks/useDocuments";
import type { UUID } from "@/types/api";

type Connection = "connecting" | "connected" | "failed";

// Kept outside the component so the session is only set up once, even though
// React runs effects twice in development and the page remounts on navigation.
let chatIdPromise: Promise<UUID> | null = null;

function getChatId(): Promise<UUID> {
	if (!chatIdPromise) {
		chatIdPromise = (async () => {
			await initAnonymousSession();
			const chat = await initChatSession({ title: "Demo Chat" });
			return chat.id;
		})().catch((error) => {
			chatIdPromise = null;
			throw error;
		});
	}

	return chatIdPromise;
}

export function DemoWorkspace() {
	const [chatId, setChatId] = useState<UUID | null>(null);
	const [connection, setConnection] = useState<Connection>("connecting");
	const [notice, setNotice] = useState<string | null>(null);
	const [settings, setSettings] = useState<AskSettings>({ ...DEFAULT_ASK_CONFIGS });
	const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
	const [isSheetOpen, setIsSheetOpen] = useState(false);

	const connect = useCallback(() => {
		setConnection("connecting");
		getChatId()
			.then((id) => {
				setChatId(id);
				setConnection("connected");
			})
			.catch((error) => {
				console.error("Failed to connect to the API", error);
				setConnection("failed");
			});
	}, []);

	useEffect(() => {
		connect();
	}, [connect]);

	function startNewChat(message: string | null) {
		chatIdPromise = null;
		setChatId(null);
		setNotice(message);
		connect();
	}

	async function handleStartOver() {
		if (chatId) {
			await deleteChatSession(chatId).catch((error) =>
				console.error("Failed to delete chat", error),
			);
		}
		startNewChat(null);
	}

	const documents = useDocuments(chatId, () => startNewChat(demoContent.sessionExpired));

	const { hints } = demoContent.chat;
	let disabledHint: string | null = null;
	if (chatId && documents.readyCount === 0 && !settings.webSearchEnabled) {
		disabledHint =
			documents.isUploading || documents.isProcessing ? hints.processing : hints.noDocuments;
	}

	const documentsPanel = (
		<DocumentsPanel
			rows={documents.rows}
			acceptedCount={documents.acceptedCount}
			isUploading={documents.isUploading}
			disabled={!chatId}
			onAddFiles={documents.addFiles}
			onRemove={documents.removeRow}
			onRetry={(row) => void documents.retryRow(row)}
			onClearAll={() => void documents.clearAll()}
			onStartOver={() => void handleStartOver()}
		/>
	);

	const statusDot =
		connection === "connected"
			? "bg-emerald-500"
			: connection === "failed"
				? "bg-red-500"
				: "animate-pulse bg-zinc-400";

	return (
		<div className="flex min-h-0 flex-1 gap-4">
			<section className="card flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl">
				<div className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-(--color-tertiary) px-4">
					<div className="flex items-center gap-3">
						<h2 className="font-semibold text-(--color-text)">
							{demoContent.chat.title}
						</h2>
						<span className="flex items-center gap-1.5 rounded-full bg-(--color-primary) px-2.5 py-1 text-xs text-(--color-text)/70">
							<span className={`h-1.5 w-1.5 rounded-full ${statusDot}`} />
							{demoContent.connection[connection]}
							{connection === "failed" && (
								<button
									type="button"
									onClick={connect}
									className="font-semibold text-(--color-accent) hover:underline"
								>
									Retry
								</button>
							)}
						</span>
					</div>

					<div className="flex gap-2">
						<button
							type="button"
							onClick={() => setIsSheetOpen(true)}
							className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-(--color-text)/70 transition hover:bg-(--color-primary) hover:text-(--color-text) md:hidden"
						>
							<FontAwesomeIcon icon={faFolderOpen} className="h-3.5! w-3.5!" />
							{documents.acceptedCount}/{UPLOAD_LIMITS.MAX_DOCUMENTS_PER_CHAT}
						</button>

						<button
							type="button"
							onClick={() => setIsAdvancedOpen((open) => !open)}
							aria-expanded={isAdvancedOpen}
							className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition ${
								isAdvancedOpen
									? "bg-(--color-accent)/10 text-(--color-accent)"
									: "text-(--color-text)/70 hover:bg-(--color-primary) hover:text-(--color-text)"
							}`}
						>
							<FontAwesomeIcon icon={faSliders} className="h-3.5! w-3.5!" />
							Advanced
						</button>
					</div>
				</div>

				{isAdvancedOpen && <ConfigPanel settings={settings} onChange={setSettings} />}

				{notice && (
					<p className="flex shrink-0 items-center justify-between gap-2 border-b border-(--color-tertiary) bg-(--color-accent)/5 px-4 py-2 text-xs text-(--color-text)/80">
						{notice}
						<button type="button" onClick={() => setNotice(null)} aria-label="Dismiss">
							<FontAwesomeIcon icon={faXmark} className="h-3! w-3!" />
						</button>
					</p>
				)}

				<ChatArea
					key={chatId ?? "connecting"}
					chatId={chatId}
					disabledHint={disabledHint}
					settings={settings}
					documentNames={documents.rows.map((row) => row.name)}
					onChatGone={() => startNewChat(demoContent.sessionExpired)}
				/>
			</section>

			<aside className="hidden w-80 shrink-0 md:block">{documentsPanel}</aside>

			{isSheetOpen && (
				<div
					role="dialog"
					aria-modal="true"
					aria-label={demoContent.documents.title}
					className="fixed inset-0 z-50 flex items-end bg-black/50 backdrop-blur-sm md:hidden"
					onClick={(event) => {
						if (event.target === event.currentTarget) setIsSheetOpen(false);
					}}
					onKeyDown={(event) => {
						if (event.key === "Escape") setIsSheetOpen(false);
					}}
				>
					<div className="flex h-[80dvh] w-full flex-col gap-1 rounded-t-3xl bg-(--color-primary) p-2">
						<button
							type="button"
							onClick={() => setIsSheetOpen(false)}
							className="self-end px-3 py-1 text-sm font-semibold text-(--color-accent)"
						>
							Done
						</button>
						<div className="min-h-0 flex-1">{documentsPanel}</div>
					</div>
				</div>
			)}
		</div>
	);
}

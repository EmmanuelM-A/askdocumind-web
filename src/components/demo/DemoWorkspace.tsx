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
	if (!chatId) {
		disabledHint = hints.connecting;
	} else if (documents.readyCount === 0 && !settings.webSearchEnabled) {
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

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-3">
			<div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2">
				<div className="flex items-center gap-2 text-sm font-medium text-(--color-text)">
					<span
						className={`h-2.5 w-2.5 rounded-full ${
							connection === "connected"
								? "bg-emerald-500"
								: connection === "failed"
									? "bg-red-500"
									: "animate-pulse bg-gray-400"
						}`}
					/>
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
				</div>

				{notice && (
					<p className="flex items-center gap-2 rounded-full bg-(--color-secondary) px-3 py-1 text-xs text-(--color-text)/80">
						{notice}
						<button type="button" onClick={() => setNotice(null)} aria-label="Dismiss">
							<FontAwesomeIcon icon={faXmark} className="h-3! w-3!" />
						</button>
					</p>
				)}
			</div>

			<div className="flex min-h-0 flex-1 gap-4">
				<aside className="hidden w-80 shrink-0 md:block">{documentsPanel}</aside>

				<section className="flex min-w-0 flex-1 flex-col gap-3">
					<div className="flex shrink-0 items-center justify-between gap-2">
						<h2 className="font-semibold text-(--color-text)">
							{demoContent.chat.title}
						</h2>

						<div className="flex gap-2">
							<button
								type="button"
								onClick={() => setIsSheetOpen(true)}
								className="flex items-center gap-2 rounded-full border border-(--color-tertiary) px-3 py-1.5 text-sm font-semibold text-(--color-text) transition hover:border-(--color-accent) hover:text-(--color-accent) md:hidden"
							>
								<FontAwesomeIcon icon={faFolderOpen} className="h-4! w-4!" />
								Documents ({documents.acceptedCount}/
								{UPLOAD_LIMITS.MAX_DOCUMENTS_PER_CHAT})
							</button>

							<button
								type="button"
								onClick={() => setIsAdvancedOpen((open) => !open)}
								aria-expanded={isAdvancedOpen}
								className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
									isAdvancedOpen
										? "border-(--color-accent) text-(--color-accent)"
										: "border-(--color-tertiary) text-(--color-text) hover:border-(--color-accent) hover:text-(--color-accent)"
								}`}
							>
								<FontAwesomeIcon icon={faSliders} className="h-4! w-4!" />
								Advanced
							</button>
						</div>
					</div>

					{isAdvancedOpen && <ConfigPanel settings={settings} onChange={setSettings} />}

					<ChatArea
						key={chatId ?? "connecting"}
						chatId={chatId}
						disabledHint={disabledHint}
						settings={settings}
						documentNames={documents.rows.map((row) => row.name)}
						onChatGone={() => startNewChat(demoContent.sessionExpired)}
					/>
				</section>
			</div>

			{isSheetOpen && (
				<div
					role="dialog"
					aria-modal="true"
					aria-label={demoContent.documents.title}
					className="fixed inset-0 z-50 flex items-end bg-black/60 md:hidden"
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

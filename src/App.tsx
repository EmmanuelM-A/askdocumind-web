import * as Sentry from "@sentry/react";
import { useCallback, useEffect, useState } from "react";
import { createAnonymousUserSession } from "@/api/auth-endpoints.ts";
import { initChatSession } from "@/api/chat-session-endpoints.ts";
import { ChatArea } from "@/components/ChatArea.tsx";
import { DocumentsArea } from "@/components/DocumentsArea.tsx";
import { FooterBar } from "@/components/FooterBar.tsx";
import { HeaderBar } from "@/components/HeaderBar.tsx";
import { settings } from "@/config/configs.ts";
import { logger } from "@/lib/logger.ts";
import type { UUID } from "@/types/api.ts";
import type { Document as UploadedDocument } from "@/types/documents.ts";

Sentry.init({
	dsn: import.meta.env.VITE_SENTRY_DSN,
	environment: import.meta.env.VITE_ENV ?? "production",
	tracesSampleRate: 0.1,
	integrations: [
		Sentry.browserTracingIntegration(),
		Sentry.replayIntegration({
			maskAllText: true, // mask user text in replays
			blockAllMedia: false,
		}),
	],
	replaysSessionSampleRate: 0.05, // record 5% of sessions
	replaysOnErrorSampleRate: 1.0, // always record on error
});

type Theme = "light" | "dark";
type DocumentTab = "upload" | "documents";

const MAX_CHAT_UPLOAD_MB = settings.documents.MAX_MB_PER_CHAT;
const MAX_CHAT_UPLOAD_BYTES = MAX_CHAT_UPLOAD_MB * 1024 * 1024;

type NoticeType = "info" | "error" | "success";

interface UploadNotice {
	type: NoticeType;
	message: string;
}

interface BootstrapResult {
	userId: UUID;
	chatId: UUID;
}

let bootstrapPromise: Promise<BootstrapResult> | null = null;

const bootstrapAnonymousUserAndChat = (): Promise<BootstrapResult> => {
	if (!bootstrapPromise) {
		bootstrapPromise = (async () => {
			const userId = await createAnonymousUserSession();
			const chat = await initChatSession({
				title: "Anonymous AskDocuMind Chat",
			});

			return { userId, chatId: chat.chat_id };
		})().catch((error) => {
			bootstrapPromise = null;
			throw error;
		});
	}

	return bootstrapPromise;
};

export default function App() {
	const [theme, setTheme] = useState<Theme>("light");
	const [activeTab, setActiveTab] = useState<DocumentTab>("upload");
	const [chatSessionId, setChatSessionId] = useState<UUID | null>(null);
	const [isChatSessionLoading, setIsChatSessionLoading] = useState(true);
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
	const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);
	const [notice, setNotice] = useState<UploadNotice | null>(null);

	const showNotice = useCallback((type: NoticeType, message: string) => {
		setNotice({ type, message });
	}, []);

	const getFileKey = (file: File): string =>
		`${file.name.toLowerCase()}::${file.size}::${file.lastModified}`;

	const handleFilesAdded = (incomingFiles: File[]) => {
		if (!incomingFiles.length) return;

		const existingKeys = new Set(selectedFiles.map(getFileKey));
		const stagedKeys = new Set<string>();
		const accepted: File[] = [];
		let duplicateCount = 0;
		let overflowCount = 0;
		let runningTotal = selectedFiles.reduce((sum, file) => sum + file.size, 0);

		for (const file of incomingFiles) {
			const key = getFileKey(file);
			if (existingKeys.has(key) || stagedKeys.has(key)) {
				duplicateCount += 1;
				continue;
			}

			if (runningTotal + file.size > MAX_CHAT_UPLOAD_BYTES) {
				overflowCount += 1;
				continue;
			}

			accepted.push(file);
			stagedKeys.add(key);
			runningTotal += file.size;
		}

		if (accepted.length) {
			setSelectedFiles((prev) => [...prev, ...accepted]);
			logger.log(
				"Files added locally:",
				accepted.map((f) => f.name),
			);
		}

		if (overflowCount > 0) {
			showNotice(
				"error",
				`${overflowCount} file(s) skipped: total selected files cannot exceed ${MAX_CHAT_UPLOAD_MB}MB.`,
			);
			return;
		}

		if (duplicateCount > 0) {
			showNotice("info", `${duplicateCount} duplicate file(s) ignored.`);
			return;
		}

		if (accepted.length > 0) {
			showNotice("success", `${accepted.length} file(s) added.`);
		}
	};

	const handleRemoveSelectedFile = (targetFile: File) => {
		const targetKey = getFileKey(targetFile);
		setSelectedFiles((prev) => prev.filter((file) => getFileKey(file) !== targetKey));
		logger.log("Removed selected file:", targetFile.name);
	};

	useEffect(() => {
		const savedTheme = localStorage.getItem("askdocumindweb-theme") as Theme | null;
		if (savedTheme) {
			setTheme(savedTheme);
			document.documentElement.setAttribute("data-theme", savedTheme);
		}
	}, []);

	useEffect(() => {
		document.documentElement.setAttribute("data-theme", theme);
		localStorage.setItem("askdocumindweb-theme", theme);
	}, [theme]);

	useEffect(() => {
		let isMounted = true;

		const bootstrapSessionData = async () => {
			setIsChatSessionLoading(true);
			try {
				const { userId, chatId } = await bootstrapAnonymousUserAndChat();
				if (!isMounted) return;

				setChatSessionId(chatId);
				logger.log("Anonymous user session created:", userId);
				logger.log("Chat session created:", chatId);
				showNotice("success", "Chat session ready.");
			} catch (error) {
				if (!isMounted) return;
				logger.error("Failed to bootstrap anonymous user + chat session:", error);
				showNotice("error", "Failed to initialize session.");
			} finally {
				if (isMounted) setIsChatSessionLoading(false);
			}
		};

		void bootstrapSessionData();

		return () => {
			isMounted = false;
		};
	}, [showNotice]);

	useEffect(() => {
		if (!notice) return;
		const timeout = setTimeout(() => setNotice(null), 2800);
		return () => clearTimeout(timeout);
	}, [notice]);

	return (
		<main className="flex h-screen flex-col overflow-hidden bg-[var(--color-primary)] text-[var(--color-text)]">
			{notice && (
				<div className="fixed right-4 top-20 z-50">
					<div
						className={`rounded-xl px-4 py-2 text-sm text-white shadow-lg ${
							notice.type === "error"
								? "bg-red-600"
								: notice.type === "success"
									? "bg-emerald-600"
									: "bg-slate-700"
						}`}
					>
						{notice.message}
					</div>
				</div>
			)}

			<HeaderBar
				theme={theme}
				onThemeToggle={() => {
					const nextTheme = theme === "dark" ? "light" : "dark";
					setTheme(nextTheme);
					logger.log(`Theme toggled: ${nextTheme}`);
				}}
			/>

			<section className="mx-auto flex w-full flex-1 min-h-0 flex-col items-center overflow-y-auto lg:overflow-hidden px-4 py-4 sm:px-6">
				<div className="grid w-full max-w-[1500px] grid-cols-1 gap-4 sm:gap-5 lg:flex-1 lg:min-h-0 lg:grid-cols-2 lg:gap-6">
					<div className="order-1 h-[360px] lg:order-2 lg:h-auto lg:min-h-0 lg:min-w-[460px] lg:overflow-hidden">
						<DocumentsArea
							theme={theme}
							chatSessionId={chatSessionId}
							isChatSessionLoading={isChatSessionLoading}
							activeTab={activeTab}
							onTabChange={setActiveTab}
							documents={uploadedDocuments}
							selectedFiles={selectedFiles}
							maxUploadBytes={MAX_CHAT_UPLOAD_BYTES}
							onFilesAdded={handleFilesAdded}
							onRemoveSelectedFile={handleRemoveSelectedFile}
							onUploadSuccess={() => setSelectedFiles([])}
							onUploadNotice={showNotice}
							onDeleteNotice={showNotice}
							onDocumentsRefreshed={setUploadedDocuments}
						/>
					</div>

					<div className="order-2 h-[360px] lg:order-1 lg:h-auto lg:min-h-0 lg:min-w-[460px] lg:overflow-hidden">
						<ChatArea
							chatSessionId={chatSessionId}
							isChatSessionLoading={isChatSessionLoading}
						/>
					</div>
				</div>
			</section>

			<FooterBar />
		</main>
	);
}

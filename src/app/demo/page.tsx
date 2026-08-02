"use client";

import { faGear, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { createAnonymousUserSession } from "@/api/auth-endpoints.ts";
import { getChatSessionMessages, initChatSession } from "@/api/chat-session-endpoints.ts";
import { getUploadedDocuments, uploadDocuments } from "@/api/document-endpoints.ts";
import { ChatArea, type ChatBubble } from "@/components/demo/ChatArea";
import { ConfigPanel } from "@/components/demo/ConfigPanel";
import { type DocumentChip, DocumentChips } from "@/components/demo/DocumentChips";
import demoContent from "@/data/demo/content.json";
import { formatBytes } from "@/lib/format.ts";
import type { UUID } from "@/types/api.ts";
import type { Document } from "@/types/documents.ts";

// Module-level (not component state) so the bootstrap only actually runs once per
// tab session, even though the effect below re-mounts on every client-side
// navigation into this page (and twice per mount in dev, per React's StrictMode).
let bootstrapPromise: Promise<{
	chatId: UUID;
	existingDocuments: Document[];
	existingMessages: ChatBubble[];
}> | null = null;

function bootstrapChatSession() {
	if (!bootstrapPromise) {
		bootstrapPromise = (async () => {
			const userId = await createAnonymousUserSession();
			console.log("Anonymous user session created:", userId);

			const chatSession = await initChatSession({ title: "Demo Chat" });
			console.log("Chat session initialized:", chatSession);

			const existingDocuments = await getUploadedDocuments(chatSession.chat_id);
			console.log("Existing documents fetched:", existingDocuments);

			const existingChatMessages = await getChatSessionMessages(chatSession.chat_id);
			console.log("Existing chat messages fetched:", existingChatMessages);

			const existingMessages = existingChatMessages
				.filter((message) => message.role === "USER" || message.role === "ASSISTANT")
				.map((message) => ({
					id: message.id,
					role: message.role as "USER" | "ASSISTANT",
					content: message.content,
					sources: message.sources,
				}));

			return { chatId: chatSession.chat_id, existingDocuments, existingMessages };
		})().catch((error) => {
			// Let the next mount retry instead of being stuck on a failed attempt forever.
			bootstrapPromise = null;
			throw error;
		});
	}

	return bootstrapPromise;
}

export default function DemoPage() {
	const [isConfigOpen, setIsConfigOpen] = useState(false);
	const [configurations, setConfigurations] = useState(demoContent.configurations);
	const [documents, setDocuments] = useState<DocumentChip[]>([]);
	const [isUploading, setIsUploading] = useState(false);
	const [connectionStatus, setConnectionStatus] = useState<"default" | "success" | "failure">(
		"default",
	);
	const [chatId, setChatId] = useState<UUID | null>(null);
	const [messages, setMessages] = useState<ChatBubble[]>([]);

	const hasPendingDocuments = documents.some((doc) => doc.status === "pending");
	const hasUploadedDocuments = documents.some((doc) => doc.status === "uploaded");
	const webSearchEnabled = Boolean(
		configurations.find((item) => item.label === "Enable Web Search Fallback")?.checked,
	);

	useEffect(() => {
		let cancelled = false;

		bootstrapChatSession()
			.then(({ chatId: bootstrappedChatId, existingDocuments, existingMessages }) => {
				if (cancelled) return;

				setChatId(bootstrappedChatId);
				setDocuments(
					existingDocuments.map((doc) => ({
						id: doc.id,
						name: doc.source,
						sizeLabel: formatBytes(doc.source_size),
						status: "uploaded",
					})),
				);
				setMessages(existingMessages);
				setConnectionStatus("success");
			})
			.catch((error) => {
				console.error("Failed to connect chat session:", error);
				if (!cancelled) setConnectionStatus("failure");
			});

		return () => {
			cancelled = true;
		};
	}, []);

	const handleUpload = async () => {
		if (!hasPendingDocuments || isUploading || !chatId) return;

		const pendingDocuments = documents.filter(
			(doc): doc is DocumentChip & { file: File } =>
				doc.status === "pending" && Boolean(doc.file),
		);

		setIsUploading(true);
		try {
			const response = await uploadDocuments({
				chatSessionId: chatId,
				documents: pendingDocuments.map((doc) => doc.file),
			});
			console.log("Documents uploaded:", response);

			const pendingIds = new Set(pendingDocuments.map((doc) => doc.id));
			setDocuments((prev) =>
				prev.map((doc) => (pendingIds.has(doc.id) ? { ...doc, status: "uploaded" } : doc)),
			);
		} catch (error) {
			console.error("Failed to upload documents:", error);
		} finally {
			setIsUploading(false);
		}
	};

	return (
		<div className="mx-auto flex h-full w-full max-w-4xl shrink-0 flex-col gap-4 overflow-hidden px-4 py-16 sm:px-6">
			<div className="flex shrink-0 items-center justify-between">
				<div className="flex items-center gap-2">
					<span
						className={`h-2.5 w-2.5 rounded-full ${
							connectionStatus === "success"
								? "bg-emerald-500"
								: connectionStatus === "failure"
									? "bg-red-500"
									: "bg-gray-400"
						}`}
					/>
					<p className="text-sm font-medium text-(--color-text)">
						{demoContent.onConnection[connectionStatus]}
					</p>
				</div>

				<button
					type="button"
					onClick={() => setIsConfigOpen((prev) => !prev)}
					className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
						isConfigOpen
							? "border-(--color-accent) text-(--color-accent)"
							: "border-(--color-tertiary) text-(--color-text) hover:border-(--color-accent) hover:text-(--color-accent)"
					}`}
				>
					<FontAwesomeIcon icon={faGear} className="h-4! w-4!" />
					Configuration
				</button>
			</div>

			{isConfigOpen && (
				<ConfigPanel
					configurations={configurations}
					onConfigurationsChange={setConfigurations}
				/>
			)}

			<div className="flex shrink-0 items-stretch gap-2">
				<DocumentChips
					chatId={chatId}
					documents={documents}
					onDocumentsChange={setDocuments}
					onUpload={() => void handleUpload()}
					isUploading={isUploading}
				/>

				<button
					type="button"
					onClick={() => void handleUpload()}
					disabled={!hasPendingDocuments || isUploading || !chatId}
					aria-label={isUploading ? "Uploading" : "Upload"}
					className="hidden shrink-0 items-center justify-center rounded-xl bg-(--color-accent) px-4 text-white transition hover:opacity-90 disabled:opacity-50 sm:flex"
				>
					<FontAwesomeIcon
						icon={faUpload}
						className={`h-6! w-6! ${isUploading ? "animate-pulse" : ""}`}
					/>
				</button>
			</div>

			<ChatArea
				chatId={chatId}
				hasUploadedDocuments={hasUploadedDocuments}
				webSearchEnabled={webSearchEnabled}
				messages={messages}
				onMessagesChange={setMessages}
			/>
		</div>
	);
}

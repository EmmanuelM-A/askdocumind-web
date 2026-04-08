import { useEffect, useState } from "react";
import { ChatArea } from "@/components/ChatArea.tsx";
import { DocumentsArea } from "@/components/DocumentsArea.tsx";
import { FooterBar } from "@/components/FooterBar.tsx";
import { HeaderBar } from "@/components/HeaderBar.tsx";
import { settings } from "@/config/configs.ts";
import type { Document as UploadedDocument } from "@/types/documents.ts";

type Theme = "light" | "dark";
type DocumentTab = "upload" | "documents";

const DEMO_CHAT_SESSION_ID = "bfac02c2-3e32-41ce-99ce-7e6ea545d583";
const MAX_CHAT_UPLOAD_MB = settings.documents.MAX_MB_PER_CHAT;
const MAX_CHAT_UPLOAD_BYTES = MAX_CHAT_UPLOAD_MB * 1024 * 1024;

type NoticeType = "info" | "error" | "success";

interface UploadNotice {
	type: NoticeType;
	message: string;
}

const demoDocuments: UploadedDocument[] = [
	{
		id: "18f73de3-ab95-4e92-afbf-5859257616e3",
		chatSessionId: DEMO_CHAT_SESSION_ID,
		filename: "architecture-notes.pdf",
		fileSize: 452010,
		vectorId: "bbff6161-d99a-4e5f-b4b7-bac2f38be2d7",
		processingStatus: "COMPLETED",
		createdAt: "2026-04-08T07:00:00.000Z",
		updatedAt: "2026-04-08T07:05:00.000Z",
	},
	{
		id: "00e7f972-1f84-4991-9960-2dcfcd56fca5",
		chatSessionId: DEMO_CHAT_SESSION_ID,
		filename: "release-plan-v2.docx",
		fileSize: 289200,
		vectorId: "2f68f9ad-913c-49f8-9f4a-300c86ce7e77",
		processingStatus: "PROCESSING",
		createdAt: "2026-04-08T07:10:00.000Z",
		updatedAt: "2026-04-08T07:11:00.000Z",
	},
];

export default function App() {
	const [theme, setTheme] = useState<Theme>("light");
	const [activeTab, setActiveTab] = useState<DocumentTab>("upload");
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
	const [notice, setNotice] = useState<UploadNotice | null>(null);

	const showNotice = (type: NoticeType, message: string) => {
		setNotice({ type, message });
	};

	const getFileKey = (file: File): string => `${file.name.toLowerCase()}::${file.size}::${file.lastModified}`;

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
			console.log("Files added locally:", accepted.map((f) => f.name));
		}

		if (overflowCount > 0) {
			showNotice("error", `${overflowCount} file(s) skipped: total selected files cannot exceed ${MAX_CHAT_UPLOAD_MB}MB.`);
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
		console.log("Removed selected file:", targetFile.name);
	};

	const handleUploadLocal = () => {
		if (!selectedFiles.length) {
			showNotice("error", "No files selected yet.");
			console.log("Upload clicked with no selected files.");
			return;
		}

		console.log("Upload action (local only, no API):", selectedFiles.map((file) => ({
			name: file.name,
			size: file.size,
			lastModified: file.lastModified,
		})));
		showNotice("success", `Upload triggered for ${selectedFiles.length} file(s) (local-only mode).`);
	};

	useEffect(() => {
		const savedTheme = localStorage.getItem("docuchat-theme") as Theme | null;
		if (savedTheme) {
			setTheme(savedTheme);
			document.documentElement.setAttribute("data-theme", savedTheme);
		}
	}, []);

	useEffect(() => {
		document.documentElement.setAttribute("data-theme", theme);
		localStorage.setItem("docuchat-theme", theme);
	}, [theme]);

	useEffect(() => {
		// Placeholder for your backend flow: create/retrieve user, then attach session(s).
		console.log("Bootstrap user/session on site visit (no auth):", {
			userCreated: true,
			chatSessionId: DEMO_CHAT_SESSION_ID,
		});
	}, []);

	useEffect(() => {
		if (!notice) return;
		const timeout = setTimeout(() => setNotice(null), 2800);
		return () => clearTimeout(timeout);
	}, [notice]);

	return (
		<main className="flex min-h-screen flex-col bg-[var(--color-primary)] text-[var(--color-text)]">
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
					console.log(`Theme toggled: ${nextTheme}`);
				}}
				onHomeClick={() => console.log("HOME clicked (informational)")}
				onGithubClick={() => console.log("GITHUB clicked (informational)")}
				onHelpClick={() => console.log("HELP clicked (informational)")}
			/>

			<section className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-4 px-4 py-5 sm:gap-5 sm:px-6 sm:py-6 lg:grid-cols-2 lg:gap-6 lg:py-7">
				<div className="order-1 lg:order-2">
					<DocumentsArea
						theme={theme}
						activeTab={activeTab}
						onTabChange={setActiveTab}
						documents={demoDocuments}
						selectedFiles={selectedFiles}
						maxUploadBytes={MAX_CHAT_UPLOAD_BYTES}
						onFilesAdded={handleFilesAdded}
						onRemoveSelectedFile={handleRemoveSelectedFile}
						onUploadSelected={handleUploadLocal}
					/>
				</div>

				<div className="order-2 lg:order-1">
					<ChatArea />
				</div>
			</section>

			<FooterBar />
		</main>
	);
}

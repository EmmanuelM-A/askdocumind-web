import { useEffect, useState } from "react";
import { ChatArea } from "@/components/ChatArea.tsx";
import { DocumentsArea } from "@/components/DocumentsArea.tsx";
import { FooterBar } from "@/components/FooterBar.tsx";
import { HeaderBar } from "@/components/HeaderBar.tsx";
import type { Document as UploadedDocument } from "@/types/documents.ts";

type Theme = "light" | "dark";
type DocumentTab = "upload" | "documents";

const DEMO_CHAT_SESSION_ID = "bfac02c2-3e32-41ce-99ce-7e6ea545d583";

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

	return (
		<main className="flex min-h-screen flex-col bg-[var(--color-primary)] text-[var(--color-text)]">
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
						activeTab={activeTab}
						onTabChange={setActiveTab}
						documents={demoDocuments}
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

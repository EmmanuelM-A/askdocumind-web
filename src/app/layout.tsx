import { config } from "@fortawesome/fontawesome-svg-core";
import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { FooterBar } from "@/components/layout/FooterBar";
import { NavBar } from "@/components/layout/NavBar";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { SITE_NAME, SITE_URL } from "@/config/constants";
import "./globals.css";

config.autoAddCss = false;

const plexSans = IBM_Plex_Sans({
	variable: "--font-plex-sans",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
	variable: "--font-plex-mono",
	subsets: ["latin"],
	weight: ["400", "500"],
});

const description =
	"A retrieval-augmented generation (RAG) demo. Upload documents or code, ask questions, and get answers drawn from your files, along with the documents and web pages each answer used.";

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	title: {
		default: `${SITE_NAME} | Ask your documents anything`,
		template: `%s | ${SITE_NAME}`,
	},
	description,
	keywords: [
		"AskDocuMind",
		"document QA",
		"RAG",
		"retrieval augmented generation",
		"chat with documents",
		"document chatbot API",
		"FastAPI",
		"LangChain",
		"pgvector",
		"reranking",
	],
	authors: [{ name: SITE_NAME }],
	openGraph: {
		type: "website",
		url: SITE_URL,
		siteName: SITE_NAME,
		title: `${SITE_NAME} | Ask your documents anything`,
		description,
	},
	twitter: {
		card: "summary",
		title: `${SITE_NAME} | Ask your documents anything`,
		description,
	},
	icons: {
		icon: "/icon.svg",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={`${plexSans.variable} ${plexMono.variable} h-full antialiased`}
			suppressHydrationWarning
		>
			<head>
				<script
					// biome-ignore lint/security/noDangerouslySetInnerHtml: must run before hydration to set the theme attribute before first paint, avoiding a flash of the wrong theme
					dangerouslySetInnerHTML={{
						__html: `try {
	var theme = localStorage.getItem("askdocumindweb-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
	document.documentElement.setAttribute("data-theme", theme);
} catch (e) {}`,
					}}
				/>
			</head>
			<body className="min-h-full flex flex-col">
				<NavBar />
				<ScrollToTop />
				{/* biome-ignore lint/correctness/useUniqueElementIds: singleton root scroll container, needed as a stable target for programmatic scrolling */}
				<main id="page-scroll" className="flex flex-1 flex-col overflow-y-auto pt-16">
					<div className="flex flex-1 flex-col">{children}</div>
					<FooterBar />
				</main>
			</body>
		</html>
	);
}

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
	"AskDocuMind is a document-aware chatbot API. Upload a PDF, DOCX, TXT, or Markdown file, ask a question in plain language, and get an answer grounded in its content, with sources cited.";

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
		"chat with PDF",
		"document chatbot API",
		"LangChain",
		"pgvector",
	],
	authors: [{ name: SITE_NAME }],
	openGraph: {
		type: "website",
		url: SITE_URL,
		siteName: SITE_NAME,
		title: `${SITE_NAME} | Ask your documents anything`,
		description,
		images: [
			{
				url: "/images/home/askdocumind-in-use-light-theme-v2.png",
				width: 1300,
				height: 976,
				alt: `${SITE_NAME} in use`,
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: `${SITE_NAME} | Ask your documents anything`,
		description,
		images: ["/images/home/askdocumind-in-use-light-theme-v2.png"],
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

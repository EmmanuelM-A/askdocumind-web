import { Link } from "react-router-dom";
import { FooterBar } from "@/components/FooterBar.tsx";
import { HeaderBar } from "@/components/HeaderBar.tsx";
import { useTheme } from "@/hooks/useTheme.ts";

function BackLink() {
	return (
		<Link
			to="/"
			className="mb-8 inline-flex items-center gap-1.5 text-sm text-[var(--color-accent)] transition hover:opacity-75"
		>
			<svg
				aria-hidden="true"
				viewBox="0 0 24 24"
				className="h-4 w-4"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
			>
				<path d="M19 12H5M12 5l-7 7 7 7" />
			</svg>
			Back to app
		</Link>
	);
}

function SectionHeading({ number, title }: { number: number; title: string }) {
	return (
		<h2 className="mb-3 mt-10 flex items-baseline gap-2 text-lg font-semibold text-[var(--color-text)]">
			<span className="font-bold text-[var(--color-accent)]">{number}.</span>
			{title}
		</h2>
	);
}

export function PrivacyPage() {
	const { theme, toggleTheme } = useTheme();

	return (
		<main className="flex h-screen flex-col overflow-hidden bg-[var(--color-primary)] text-[var(--color-text)]">
			<HeaderBar theme={theme} onThemeToggle={toggleTheme} />

			<div className="flex-1 overflow-y-auto">
				<article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
					<BackLink />

					<h1 className="text-2xl font-bold text-[var(--color-text)] sm:text-3xl">
						Privacy Policy
					</h1>
					<p className="mt-1 text-sm text-[var(--color-text)]/60">
						Last updated: June 2026
					</p>

					<hr className="my-6 border-[var(--color-tertiary)]" />

					<SectionHeading number={1} title="Overview" />
					<p className="text-sm leading-relaxed text-[var(--color-text)]/80">
						AskDocuMind is a document question-answering service. We are committed to
						handling your data minimally and transparently. This policy explains what we
						collect, how we use it, and how long we keep it.
					</p>

					<SectionHeading number={2} title="What data we collect" />
					<p className="mb-3 text-sm leading-relaxed text-[var(--color-text)]/80">
						<strong className="font-semibold text-[var(--color-text)]">
							We do not require an account.
						</strong>{" "}
						You use AskDocuMind anonymously. We collect the following:
					</p>
					<ul className="space-y-2 text-sm leading-relaxed text-[var(--color-text)]/80">
						{[
							[
								"Session identifier",
								"a randomly generated ID stored in a secure, HttpOnly cookie. It contains no personal information and is used solely to associate your uploads and messages with your session.",
							],
							[
								"Uploaded documents",
								"files you upload (PDF, DOCX, TXT, Markdown) are stored temporarily to generate answers. Their text content is extracted and converted into numerical vectors for search.",
							],
							[
								"Chat messages",
								"your questions and the AI-generated answers are stored within your session to maintain conversation context.",
							],
							[
								"Technical logs",
								"server logs may record request paths, HTTP status codes, and response times. These do not include the content of your queries or documents.",
							],
							[
								"Error reports",
								"if an error occurs, a report may be sent to Sentry (our error tracking service) including the error type and stack trace. Query content and document content are not included in error reports.",
							],
						].map(([term, desc]) => (
							<li key={term} className="flex gap-2">
								<span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
								<span>
									<strong className="font-semibold text-[var(--color-text)]">
										{term}
									</strong>{" "}
									— {desc}
								</span>
							</li>
						))}
					</ul>
					<p className="mt-4 text-sm leading-relaxed text-[var(--color-text)]/80">
						<strong className="font-semibold text-[var(--color-text)]">
							We do not collect
						</strong>{" "}
						your name, email address, IP address (beyond what is processed transiently
						by our hosting infrastructure), or any other personally identifiable
						information.
					</p>

					<SectionHeading number={3} title="How uploaded documents are handled" />
					<ul className="space-y-2 text-sm leading-relaxed text-[var(--color-text)]/80">
						{[
							"Documents are uploaded to our servers and stored temporarily for the duration of your session.",
							"The text content of your documents is extracted and split into chunks, which are embedded as vectors and stored in our database to enable semantic search.",
							"Your documents and their vector representations are deleted automatically when your session expires (see section 4).",
							"The text content of your documents is sent to OpenAI's API to generate answers. OpenAI's data usage policies apply to this processing.",
							"If web search is enabled and your query cannot be answered from your documents, your query text is sent to Brave Search API to retrieve relevant web results.",
						].map((item) => (
							<li key={item} className="flex gap-2">
								<span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
								<span>{item}</span>
							</li>
						))}
					</ul>

					<SectionHeading number={4} title="Retention periods" />
					<div className="overflow-x-auto rounded-lg border border-[var(--color-tertiary)]">
						<table className="w-full text-sm">
							<thead>
								<tr className="bg-[var(--color-secondary)] text-left text-[var(--color-text)]">
									<th className="px-4 py-3 font-semibold">Data</th>
									<th className="px-4 py-3 font-semibold">Retention</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-[var(--color-tertiary)]">
								{[
									["Session cookie", "1 hour from last activity"],
									["Uploaded documents (files)", "Deleted when session expires"],
									[
										"Document vectors (embeddings)",
										"Deleted when session expires",
									],
									["Chat messages", "Deleted when session expires"],
									["Server logs", "Up to 30 days"],
									["Error reports (Sentry)", "Up to 90 days"],
								].map(([data, retention]) => (
									<tr
										key={data}
										className="text-[var(--color-text)]/80 transition hover:bg-[var(--color-secondary)]/50"
									>
										<td className="px-4 py-3 font-medium text-[var(--color-text)]">
											{data}
										</td>
										<td className="px-4 py-3">{retention}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					<p className="mt-3 text-sm leading-relaxed text-[var(--color-text)]/80">
						Sessions inactive for more than 1 hour are purged automatically by a
						background cleanup process.
					</p>

					<SectionHeading number={5} title="Third-party services" />
					<div className="overflow-x-auto rounded-lg border border-[var(--color-tertiary)]">
						<table className="w-full text-sm">
							<thead>
								<tr className="bg-[var(--color-secondary)] text-left text-[var(--color-text)]">
									<th className="px-4 py-3 font-semibold">Service</th>
									<th className="px-4 py-3 font-semibold">Purpose</th>
									<th className="px-4 py-3 font-semibold">Privacy policy</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-[var(--color-tertiary)]">
								{[
									[
										"OpenAI",
										"LLM response generation and document embedding",
										"openai.com/policies",
										"https://openai.com/policies",
									],
									[
										"Brave Search",
										"Optional web search fallback",
										"brave.com/privacy-policy",
										"https://api-dashboard.search.brave.com/privacy-policy",
									],
									[
										"Railway",
										"Backend hosting and database",
										"railway.app/legal/privacy",
										"https://railway.app/legal/privacy",
									],
									[
										"Cloudflare",
										"CDN, DNS, and DDoS protection",
										"cloudflare.com/privacypolicy",
										"https://www.cloudflare.com/privacypolicy",
									],
									[
										"Sentry",
										"Error tracking",
										"sentry.io/privacy",
										"https://sentry.io/privacy",
									],
									[
										"Vercel",
										"Frontend hosting",
										"vercel.com/legal/privacy-policy",
										"https://vercel.com/legal/privacy-policy",
									],
								].map(([service, purpose, label, href]) => (
									<tr
										key={service}
										className="text-[var(--color-text)]/80 transition hover:bg-[var(--color-secondary)]/50"
									>
										<td className="px-4 py-3 font-medium text-[var(--color-text)]">
											{service}
										</td>
										<td className="px-4 py-3">{purpose}</td>
										<td className="px-4 py-3">
											<a
												href={href}
												target="_blank"
												rel="noopener noreferrer"
												className="text-[var(--color-accent)] underline-offset-2 hover:underline"
											>
												{label}
											</a>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					<SectionHeading number={6} title="Cookies" />
					<p className="mb-3 text-sm leading-relaxed text-[var(--color-text)]/80">
						We use a single cookie (
						<code className="rounded bg-[var(--color-secondary)] px-1 py-0.5 font-mono text-xs">
							askdocumind_user_cookie
						</code>
						) to maintain your anonymous session. It is:
					</p>
					<ul className="space-y-2 text-sm leading-relaxed text-[var(--color-text)]/80">
						{[
							["HttpOnly", "not accessible to JavaScript"],
							["Secure", "transmitted over HTTPS only"],
							[
								"SameSite=None",
								"required for cross-origin requests between the frontend and backend",
							],
						].map(([term, desc]) => (
							<li key={term} className="flex gap-2">
								<span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
								<span>
									<strong className="font-semibold text-[var(--color-text)]">
										{term}
									</strong>{" "}
									— {desc}
								</span>
							</li>
						))}
					</ul>
					<p className="mt-3 text-sm leading-relaxed text-[var(--color-text)]/80">
						We do not use advertising cookies, analytics cookies, or any third-party
						tracking cookies.
					</p>

					<SectionHeading number={7} title="Your rights" />
					<p className="text-sm leading-relaxed text-[var(--color-text)]/80">
						Because we do not collect personal data and sessions are anonymous, there is
						no personal profile to access, correct, or delete. Your data is deleted
						automatically when your session expires. If you wish to remove your data
						immediately, clearing your browser cookies ends your session and the
						associated data will be purged on the next cleanup cycle.
					</p>

					<SectionHeading number={8} title="Contact" />
					<p className="text-sm leading-relaxed text-[var(--color-text)]/80">
						For privacy-related questions, contact:{" "}
						<a
							href="mailto:madukaagbeze.ea@gmail.com"
							className="text-[var(--color-accent)] underline-offset-2 hover:underline"
						>
							madukaagbeze.ea@gmail.com
						</a>
					</p>

					<div className="mt-12 pb-4">
						<BackLink />
					</div>
				</article>
			</div>

			<FooterBar />
		</main>
	);
}

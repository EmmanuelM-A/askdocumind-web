import fs from "node:fs/promises";
import path from "node:path";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { NumberedSectionHeading } from "@/components/layout/SectionHeadings";
import { BackLink } from "@/components/navigation/BackLink";

function getText(children: React.ReactNode): string {
	if (typeof children === "string") return children;
	if (typeof children === "number") return String(children);
	if (Array.isArray(children)) return children.map(getText).join("");
	return "";
}

export const components: Components = {
	h1: ({ children }) => (
		<h1 className="text-2xl font-bold text-(--color-text) sm:text-3xl">{children}</h1>
	),
	h2: ({ children }) => {
		const text = getText(children);
		const match = text.match(/^(\d+)\.\s*(.*)$/);

		if (match) {
			return <NumberedSectionHeading number={Number(match[1])} title={match[2]} />;
		}

		return <h2 className="mt-10 mb-3 text-lg font-semibold text-(--color-text)">{children}</h2>;
	},
	p: ({ children }) => (
		<p className="mb-3 text-sm leading-relaxed text-(--color-text)/80">{children}</p>
	),
	ul: ({ children }) => (
		<ul className="mb-3 space-y-2 text-sm leading-relaxed text-(--color-text)/80">
			{children}
		</ul>
	),
	li: ({ children }) => (
		<li className="flex gap-2">
			<span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-(--color-accent)" />
			<span>{children}</span>
		</li>
	),
	strong: ({ children }) => (
		<strong className="font-semibold text-(--color-text)">{children}</strong>
	),
	code: ({ children }) => (
		<code className="rounded bg-(--color-secondary) px-1 py-0.5 font-mono text-xs">
			{children}
		</code>
	),
	a: ({ href, children }) => (
		<a
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			className="text-(--color-accent) underline-offset-2 hover:underline"
		>
			{children}
		</a>
	),
	hr: () => <hr className="my-6 border-(--color-tertiary)" />,
	table: ({ children }) => (
		<div className="mb-3 overflow-x-auto rounded-lg border border-(--color-tertiary)">
			<table className="w-full text-sm">{children}</table>
		</div>
	),
	thead: ({ children }) => (
		<thead className="bg-(--color-secondary) text-left text-(--color-text)">{children}</thead>
	),
	tbody: ({ children }) => (
		<tbody className="divide-y divide-(--color-tertiary)">{children}</tbody>
	),
	tr: ({ children }) => (
		<tr className="text-(--color-text)/80 transition hover:bg-(--color-secondary)/50">
			{children}
		</tr>
	),
	th: ({ children }) => <th className="px-4 py-3 font-semibold">{children}</th>,
	td: ({ children }) => <td className="px-4 py-3">{children}</td>,
};

export default async function TermsOfConditionsPage() {
	const filePath = path.join(process.cwd(), "src/data/terms/content.md");
	const content = await fs.readFile(filePath, "utf-8");

	return (
		<article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
			<BackLink buttonText="Back to app" backTo="/" />

			<ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
				{content}
			</ReactMarkdown>

			<div className="mt-12 pb-4">
				<BackLink buttonText="Back to app" backTo="/" />
			</div>
		</article>
	);
}

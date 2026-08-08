"use client";

import { faPaperclip } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import feedbackContent from "@/data/feedback/content.json";

export function ReportBugSection() {
	const { supportingText, severities } = feedbackContent.reportBug;

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [severity, setSeverity] = useState(severities[0]);

	const handleSubmit = () => {
		console.log("submit bug report clicked", { title, description, severity });
	};

	return (
		<div className="flex flex-col gap-5">
			<p className="text-sm text-(--color-text)/70">{supportingText}</p>

			<div className="flex flex-col gap-1.5">
				<label htmlFor="bug-title" className="text-xs font-semibold text-(--color-text)/70">
					Title
				</label>
				{/* biome-ignore lint/correctness/useUniqueElementIds: singleton section, needed for label association */}
				<input
					id="bug-title"
					value={title}
					onChange={(event) => setTitle(event.target.value)}
					placeholder="Answer stops mid response on large PDFs"
					className="w-full rounded-xl border border-(--color-tertiary) bg-(--color-secondary) px-3 py-2 text-sm text-(--color-text) outline-none placeholder:text-(--color-text)/50 focus:border-(--color-accent)"
				/>
			</div>

			<div className="flex flex-col gap-1.5">
				<label
					htmlFor="bug-description"
					className="text-xs font-semibold text-(--color-text)/70"
				>
					What happened
				</label>
				{/* biome-ignore lint/correctness/useUniqueElementIds: singleton section, needed for label association */}
				<textarea
					id="bug-description"
					value={description}
					onChange={(event) => setDescription(event.target.value)}
					placeholder="Describe what you expected and what happened instead"
					rows={4}
					className="w-full resize-none rounded-xl border border-(--color-tertiary) bg-(--color-secondary) p-3 text-sm text-(--color-text) outline-none placeholder:text-(--color-text)/50 focus:border-(--color-accent)"
				/>
			</div>

			<div className="flex flex-col gap-1.5">
				<p className="text-xs font-semibold text-(--color-text)/70">Severity</p>
				<div className="flex flex-wrap gap-2">
					{severities.map((option) => (
						<button
							key={option}
							type="button"
							onClick={() => {
								console.log(`severity selected: ${option}`);
								setSeverity(option);
							}}
							className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
								severity === option
									? "border-emerald-500 text-emerald-500"
									: "border-(--color-tertiary) text-(--color-text)/70 hover:border-(--color-accent) hover:text-(--color-accent)"
							}`}
						>
							{option}
						</button>
					))}
				</div>
			</div>

			<button
				type="button"
				onClick={() => console.log("attach screenshot clicked")}
				className="flex items-center gap-2 self-start rounded-xl border border-(--color-tertiary) px-4 py-2 text-sm font-medium text-(--color-text) transition hover:border-(--color-accent) hover:text-(--color-accent)"
			>
				<FontAwesomeIcon icon={faPaperclip} className="h-3.5! w-3.5!" />
				Attach screenshot
			</button>

			<button
				type="button"
				onClick={handleSubmit}
				disabled={!title.trim() || !description.trim()}
				className="self-start rounded-full bg-(--color-accent) px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
			>
				Submit bug report
			</button>
		</div>
	);
}

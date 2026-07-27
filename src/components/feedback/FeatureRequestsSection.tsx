"use client";

import { faCheck, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import feedbackContent from "@/data/feedback/content.json";

type RequestStatus = "Under review" | "Planned" | "In progress" | "Done";

interface FeatureRequest {
	id: string;
	title: string;
	votes: number;
	suggestedBy: string;
	status: RequestStatus;
}

const statusStyles: Record<RequestStatus, string> = {
	"Under review": "bg-(--color-tertiary)/40 text-(--color-text)/70",
	Planned: "bg-(--color-accent)/15 text-(--color-accent)",
	"In progress": "bg-emerald-500/15 text-emerald-500",
	Done: "bg-(--color-tertiary)/30 text-(--color-text)/50",
};

export function FeatureRequestsSection() {
	const { supportingText, items } = feedbackContent.featureRequests;
	const [requests, setRequests] = useState<FeatureRequest[]>(items as FeatureRequest[]);
	const [isSuggesting, setIsSuggesting] = useState(false);
	const [draftTitle, setDraftTitle] = useState("");
	const [draftDescription, setDraftDescription] = useState("");

	const handleUpvote = (id: string) => {
		console.log(`upvote clicked: request id ${id}`);
		setRequests((prev) =>
			prev.map((request) =>
				request.id === id ? { ...request, votes: request.votes + 1 } : request,
			),
		);
	};

	const handleSuggestFeature = () => {
		console.log("suggest a feature clicked", {
			title: draftTitle,
			description: draftDescription,
		});
		setIsSuggesting(false);
		setDraftTitle("");
		setDraftDescription("");
	};

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<p className="text-sm text-(--color-text)/70">{supportingText}</p>

				<button
					type="button"
					onClick={() => {
						console.log(
							isSuggesting ? "suggest a feature closed" : "suggest a feature clicked",
						);
						setIsSuggesting((prev) => !prev);
					}}
					className="flex shrink-0 items-center gap-2 self-start rounded-full border border-(--color-tertiary) px-4 py-2 text-sm font-semibold text-(--color-text) transition hover:border-(--color-accent) hover:text-(--color-accent) sm:self-center"
				>
					+ Suggest a feature
				</button>
			</div>

			{isSuggesting && (
				<div className="flex flex-col gap-3 rounded-2xl border border-(--color-tertiary) bg-(--color-secondary) p-4 shadow-sm">
					<input
						value={draftTitle}
						onChange={(event) => setDraftTitle(event.target.value)}
						placeholder="Feature title"
						className="w-full rounded-xl border border-(--color-tertiary) bg-(--color-primary) px-3 py-2 text-sm text-(--color-text) outline-none placeholder:text-(--color-text)/50 focus:border-(--color-accent)"
					/>
					<textarea
						value={draftDescription}
						onChange={(event) => setDraftDescription(event.target.value)}
						placeholder="Describe what you'd like to see"
						rows={3}
						className="w-full resize-none rounded-xl border border-(--color-tertiary) bg-(--color-primary) p-3 text-sm text-(--color-text) outline-none placeholder:text-(--color-text)/50 focus:border-(--color-accent)"
					/>
					<button
						type="button"
						onClick={handleSuggestFeature}
						disabled={!draftTitle.trim()}
						className="self-start rounded-full bg-(--color-accent) px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
					>
						Submit
					</button>
				</div>
			)}

			<div className="flex flex-col gap-3">
				{requests.map((request) => (
					<div
						key={request.id}
						className={`flex items-center gap-4 rounded-2xl border border-(--color-tertiary) bg-(--color-secondary) p-4 shadow-sm ${
							request.status === "Done" ? "opacity-60" : ""
						}`}
					>
						{request.status === "Done" ? (
							<div className="flex w-10 shrink-0 flex-col items-center gap-0.5 text-emerald-500">
								<FontAwesomeIcon icon={faCheck} className="h-4! w-4!" />
							</div>
						) : (
							<button
								type="button"
								onClick={() => handleUpvote(request.id)}
								className="flex w-10 shrink-0 flex-col items-center gap-0.5 rounded-xl border border-(--color-tertiary) py-1.5 text-(--color-text)/70 transition hover:border-(--color-accent) hover:text-(--color-accent)"
							>
								<FontAwesomeIcon icon={faChevronUp} className="h-3! w-3!" />
								<span className="text-xs font-semibold">{request.votes}</span>
							</button>
						)}

						<div className="min-w-0 flex-1">
							<p className="truncate text-sm font-semibold text-(--color-text)">
								{request.title}
							</p>
							<p className="text-xs text-(--color-text)/60">{request.suggestedBy}</p>
						</div>

						<span
							className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ${statusStyles[request.status]}`}
						>
							{request.status}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}

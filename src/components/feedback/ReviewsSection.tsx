"use client";

import { useState } from "react";
import { StarRating } from "@/components/feedback/StarRating";
import feedbackContent from "@/data/feedback/content.json";

function getInitials(name: string): string {
	return name
		.split(" ")
		.map((part) => part[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();
}

export function ReviewsSection() {
	const { average, count, items } = feedbackContent.reviews;
	const [isWritingReview, setIsWritingReview] = useState(false);
	const [draftRating, setDraftRating] = useState(0);
	const [draftText, setDraftText] = useState("");

	const handleSubmitReview = () => {
		console.log("submit review clicked", { rating: draftRating, text: draftText });
		setIsWritingReview(false);
		setDraftRating(0);
		setDraftText("");
	};

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex items-center gap-4">
					<p className="text-4xl font-bold text-(--color-text)">{average}</p>
					<div>
						<StarRating rating={average} size="md" />
						<p className="mt-1 text-xs text-(--color-text)/60">
							Based on {count} reviews
						</p>
					</div>
				</div>

				<button
					type="button"
					onClick={() => {
						if (isWritingReview) {
							console.log("write a review closed");
						} else {
							console.log("write a review clicked");
						}
						setIsWritingReview((prev) => !prev);
					}}
					className="self-start rounded-full border border-(--color-tertiary) px-4 py-2 text-sm font-semibold text-(--color-text) transition hover:border-(--color-accent) hover:text-(--color-accent) sm:self-center"
				>
					Write a review
				</button>
			</div>

			{isWritingReview && (
				<div className="flex flex-col gap-3 rounded-2xl border border-(--color-tertiary) bg-(--color-secondary) p-4 shadow-sm">
					<StarRating
						rating={draftRating}
						interactive
						size="lg"
						onChange={setDraftRating}
					/>
					<textarea
						value={draftText}
						onChange={(event) => setDraftText(event.target.value)}
						placeholder="Share your experience..."
						rows={3}
						className="w-full resize-none rounded-xl border border-(--color-tertiary) bg-(--color-primary) p-3 text-sm text-(--color-text) outline-none placeholder:text-(--color-text)/50 focus:border-(--color-accent)"
					/>
					<button
						type="button"
						onClick={handleSubmitReview}
						disabled={!draftRating || !draftText.trim()}
						className="self-start rounded-full bg-(--color-accent) px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
					>
						Submit review
					</button>
				</div>
			)}

			{items.length > 0 ? (
				<div className="flex flex-col gap-3">
					{items.map((review) => (
						<article
							key={review.id}
							className="rounded-2xl border border-(--color-tertiary) bg-(--color-secondary) p-4 shadow-sm"
						>
							<div className="flex items-center gap-3">
								<span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-(--color-accent) text-xs font-semibold text-white">
									{getInitials(review.name)}
								</span>
								<div className="flex min-w-0 flex-1 items-center justify-between gap-2">
									<p className="truncate text-sm font-semibold text-(--color-text)">
										{review.name}
									</p>
									<StarRating rating={review.rating} size="sm" />
								</div>
							</div>
							<p className="mt-3 text-sm text-(--color-text)/80">{review.text}</p>
						</article>
					))}
				</div>
			) : (
				<p className="text-center text-sm text-(--color-text)/60">
					No reviews yet. Be the first to share your experience.
				</p>
			)}
		</div>
	);
}

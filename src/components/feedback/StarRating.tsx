"use client";

import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface StarRatingProps {
	rating: number;
	max?: number;
	size?: "sm" | "md" | "lg";
	interactive?: boolean;
	onChange?: (value: number) => void;
}

const sizeClasses: Record<NonNullable<StarRatingProps["size"]>, string> = {
	sm: "h-3.5! w-3.5!",
	md: "h-4! w-4!",
	lg: "h-6! w-6!",
};

export function StarRating({
	rating,
	max = 5,
	size = "md",
	interactive,
	onChange,
}: StarRatingProps) {
	const iconClass = sizeClasses[size];

	return (
		<div className="flex items-center gap-1" role={interactive ? "radiogroup" : undefined}>
			{Array.from({ length: max }, (_, index) => {
				const fillPercent = Math.max(0, Math.min(1, rating - index)) * 100;

				if (interactive) {
					return (
						<button
							// biome-ignore lint/suspicious/noArrayIndexKey: fixed-length star sequence with no other unique identity
							key={index}
							type="button"
							aria-label={`${index + 1} star${index === 0 ? "" : "s"}`}
							onClick={() => onChange?.(index + 1)}
							className="cursor-pointer"
						>
							<FontAwesomeIcon
								icon={faStar}
								className={`${iconClass} ${
									index < rating
										? "text-(--color-accent)"
										: "text-(--color-tertiary)"
								}`}
							/>
						</button>
					);
				}

				return (
					// biome-ignore lint/suspicious/noArrayIndexKey: fixed-length star sequence with no other unique identity
					<span key={index} className="relative inline-block">
						<FontAwesomeIcon
							icon={faStar}
							className={`${iconClass} text-(--color-tertiary)`}
						/>
						<span
							className="absolute inset-0 overflow-hidden"
							style={{ width: `${fillPercent}%` }}
						>
							<FontAwesomeIcon
								icon={faStar}
								className={`${iconClass} text-(--color-accent)`}
							/>
						</span>
					</span>
				);
			})}
		</div>
	);
}

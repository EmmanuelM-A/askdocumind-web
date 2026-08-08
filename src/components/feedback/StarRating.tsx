"use client";

import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type PointerEvent, useRef, useState } from "react";

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
	const containerRef = useRef<HTMLDivElement>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [hoverRating, setHoverRating] = useState<number | null>(null);

	const displayRating = interactive ? (hoverRating ?? rating) : rating;

	const valueFromPointer = (clientX: number) => {
		const el = containerRef.current;
		if (!el) return rating;
		const { left, width } = el.getBoundingClientRect();
		const fraction = (clientX - left) / width;
		const raw = Math.max(0, Math.min(max, fraction * max));
		return Math.round(raw * 2) / 2;
	};

	const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
		event.currentTarget.setPointerCapture(event.pointerId);
		setIsDragging(true);
		const value = valueFromPointer(event.clientX);
		setHoverRating(value);
		onChange?.(value);
	};

	const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
		const value = valueFromPointer(event.clientX);
		setHoverRating(value);
		if (isDragging) onChange?.(value);
	};

	const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
		event.currentTarget.releasePointerCapture(event.pointerId);
		setIsDragging(false);
		setHoverRating(null);
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.key === "ArrowRight" || event.key === "ArrowUp") {
			event.preventDefault();
			onChange?.(Math.min(max, rating + 0.5));
		} else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
			event.preventDefault();
			onChange?.(Math.max(0, rating - 0.5));
		}
	};

	const stars = Array.from({ length: max }, (_, index) => {
		const fillPercent = Math.max(0, Math.min(1, displayRating - index)) * 100;

		return (
			// biome-ignore lint/suspicious/noArrayIndexKey: fixed-length star sequence with no other unique identity
			<span key={index} className="relative inline-block">
				<FontAwesomeIcon icon={faStar} className={`${iconClass} text-(--color-tertiary)`} />
				<span className="absolute inset-0 overflow-hidden" style={{ width: `${fillPercent}%` }}>
					<FontAwesomeIcon icon={faStar} className={`${iconClass} text-(--color-accent)`} />
				</span>
			</span>
		);
	});

	if (!interactive) {
		return <div className="flex items-center gap-1">{stars}</div>;
	}

	return (
		<div
			ref={containerRef}
			className="flex cursor-pointer items-center gap-1 touch-none select-none"
			role="slider"
			tabIndex={0}
			aria-valuemin={0}
			aria-valuemax={max}
			aria-valuenow={rating}
			onPointerDown={handlePointerDown}
			onPointerMove={handlePointerMove}
			onPointerUp={handlePointerUp}
			onPointerLeave={() => {
				if (!isDragging) setHoverRating(null);
			}}
			onKeyDown={handleKeyDown}
		>
			{stars}
		</div>
	);
}

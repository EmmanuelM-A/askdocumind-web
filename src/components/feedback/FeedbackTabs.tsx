"use client";

export type FeedbackTab = "reviews" | "featureRequests" | "reportBug";

interface FeedbackTabsProps {
	activeTab: FeedbackTab;
	onTabChange: (tab: FeedbackTab) => void;
}

const tabs: { id: FeedbackTab; label: string }[] = [
	{ id: "reviews", label: "Reviews" },
	{ id: "featureRequests", label: "Feature requests" },
	{ id: "reportBug", label: "Report a bug" },
];

export function FeedbackTabs({ activeTab, onTabChange }: FeedbackTabsProps) {
	return (
		<div
			role="tablist"
			aria-label="Feedback sections"
			className="flex flex-wrap gap-6 border-b border-(--color-tertiary)"
		>
			{tabs.map((tab) => (
				<button
					key={tab.id}
					type="button"
					role="tab"
					aria-selected={activeTab === tab.id}
					onClick={() => {
						console.log(`tab switched: ${tab.label}`);
						onTabChange(tab.id);
					}}
					className={`-mb-px border-b-2 pb-3 text-sm font-semibold transition ${
						activeTab === tab.id
							? "border-(--color-accent) text-(--color-accent)"
							: "border-transparent text-(--color-text)/60 hover:text-(--color-text)"
					}`}
				>
					{tab.label}
				</button>
			))}
		</div>
	);
}

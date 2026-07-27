"use client";

// import { ComingSoon } from "@/components/utils/ComingSoon";
//
// export default function FeedbackPage() {
// 	return (
// 		<ComingSoon
// 			title="Feedback Page Coming Soon"
// 			description="A way to provide feeback, report bugs, and request features is on the way!"
// 		/>
// 	);
// }

import { useState } from "react";
import { FeatureRequestsSection } from "@/components/feedback/FeatureRequestsSection";
import { type FeedbackTab, FeedbackTabs } from "@/components/feedback/FeedbackTabs";
import { ReportBugSection } from "@/components/feedback/ReportBugSection";
import { ReviewsSection } from "@/components/feedback/ReviewsSection";

export default function FeedbackPage() {
	const [activeTab, setActiveTab] = useState<FeedbackTab>("reviews");

	return (
		<div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-12 sm:px-6 sm:py-16">
			<FeedbackTabs activeTab={activeTab} onTabChange={setActiveTab} />

			{activeTab === "reviews" && <ReviewsSection />}
			{activeTab === "featureRequests" && <FeatureRequestsSection />}
			{activeTab === "reportBug" && <ReportBugSection />}
		</div>
	);
}

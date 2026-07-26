"use client";

import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { ChatArea } from "@/components/demo/ChatArea";
import { ConfigPanel } from "@/components/demo/ConfigPanel";
import { DocumentChips } from "@/components/demo/DocumentChips";
import demoContent from "@/data/demo/content.json";

export default function DemoPage() {
	const [isConfigOpen, setIsConfigOpen] = useState(false);
	const [configurations, setConfigurations] = useState(demoContent.configurations);

	return (
		<div className="mx-auto flex h-full w-full max-w-4xl shrink-0 flex-col gap-4 overflow-hidden px-4 py-16 sm:px-6">
			<div className="flex shrink-0 items-center justify-between">
				<div className="flex items-center gap-2">
					<span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
					<p className="text-sm font-medium text-(--color-text)">
						{demoContent.onConnection.success}
					</p>
				</div>

				<button
					type="button"
					onClick={() => setIsConfigOpen((prev) => !prev)}
					className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
						isConfigOpen
							? "border-(--color-accent) text-(--color-accent)"
							: "border-(--color-tertiary) text-(--color-text) hover:border-(--color-accent) hover:text-(--color-accent)"
					}`}
				>
					<FontAwesomeIcon icon={faGear} className="h-4! w-4!" />
					Configuration
				</button>
			</div>

			{isConfigOpen && (
				<ConfigPanel
					configurations={configurations}
					onConfigurationsChange={setConfigurations}
				/>
			)}

			<DocumentChips />

			<ChatArea />
		</div>
	);
}

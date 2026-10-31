"use client";

import { DEFAULT_ASK_CONFIGS } from "@/config/constants";
import demoContent from "@/data/demo/content.json";
import type { AskConfigs } from "@/types/chatbot";

export type AskSettings = Required<AskConfigs>;

interface ConfigPanelProps {
	settings: AskSettings;
	onChange: (settings: AskSettings) => void;
}

const { advanced } = demoContent;

export function ConfigPanel({ settings, onChange }: ConfigPanelProps) {
	const isDefault =
		settings.topK === DEFAULT_ASK_CONFIGS.topK &&
		settings.threshold === DEFAULT_ASK_CONFIGS.threshold &&
		settings.webSearchEnabled === DEFAULT_ASK_CONFIGS.webSearchEnabled;

	return (
		<div className="shrink-0 border-b border-(--color-tertiary) bg-(--color-primary)/60 px-4 py-4 text-sm">
			<div className="grid gap-5 sm:grid-cols-3">
				<label className="flex cursor-pointer flex-col gap-1.5">
					<span className="flex items-center justify-between gap-3 font-medium text-(--color-text)">
						{advanced.webSearch.label}
						<input
							type="checkbox"
							checked={settings.webSearchEnabled}
							onChange={(event) =>
								onChange({ ...settings, webSearchEnabled: event.target.checked })
							}
							className="peer sr-only"
						/>
						<span className="relative h-5 w-9 shrink-0 rounded-full bg-(--color-tertiary) transition peer-checked:bg-(--color-accent) peer-focus-visible:ring-2 peer-focus-visible:ring-(--color-accent)/40 after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:translate-x-4" />
					</span>
					<span className="text-xs text-(--color-text)/55">
						{advanced.webSearch.hint}
					</span>
				</label>

				<label className="flex flex-col gap-1.5">
					<span className="flex justify-between font-medium text-(--color-text)">
						{advanced.topK.label}
						<span className="text-xs text-(--color-accent) tabular-nums">
							{settings.topK}
						</span>
					</span>
					<input
						type="range"
						min={1}
						max={100}
						step={1}
						value={settings.topK}
						onChange={(event) =>
							onChange({ ...settings, topK: Number(event.target.value) })
						}
						className="accent-(--color-accent)"
					/>
					<span className="text-xs text-(--color-text)/55">{advanced.topK.hint}</span>
				</label>

				<label className="flex flex-col gap-1.5">
					<span className="flex justify-between font-medium text-(--color-text)">
						{advanced.threshold.label}
						<span className="text-xs text-(--color-accent) tabular-nums">
							{settings.threshold.toFixed(2)}
						</span>
					</span>
					<input
						type="range"
						min={0}
						max={1}
						step={0.05}
						value={settings.threshold}
						onChange={(event) =>
							onChange({ ...settings, threshold: Number(event.target.value) })
						}
						className="accent-(--color-accent)"
					/>
					<span className="text-xs text-(--color-text)/55">
						{advanced.threshold.hint}
					</span>
				</label>
			</div>

			<button
				type="button"
				onClick={() => onChange({ ...DEFAULT_ASK_CONFIGS })}
				disabled={isDefault}
				className="mt-4 text-xs font-medium text-(--color-accent) hover:underline disabled:pointer-events-none disabled:opacity-40"
			>
				Reset to defaults
			</button>
		</div>
	);
}

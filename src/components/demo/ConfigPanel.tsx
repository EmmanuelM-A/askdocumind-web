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
		<div className="flex shrink-0 flex-col gap-4 rounded-2xl border border-(--color-tertiary) bg-(--color-secondary) p-4 text-sm shadow-sm">
			<label className="flex cursor-pointer items-start gap-3">
				<input
					type="checkbox"
					checked={settings.webSearchEnabled}
					onChange={(event) =>
						onChange({ ...settings, webSearchEnabled: event.target.checked })
					}
					className="mt-1 accent-(--color-accent)"
				/>
				<span>
					<span className="font-medium text-(--color-text)">
						{advanced.webSearch.label}
					</span>
					<span className="block text-xs text-(--color-text)/60">
						{advanced.webSearch.hint}
					</span>
				</span>
			</label>

			<label className="flex flex-col gap-1">
				<span className="flex justify-between font-medium text-(--color-text)">
					{advanced.topK.label}
					<span className="font-mono">{settings.topK}</span>
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
				<span className="text-xs text-(--color-text)/60">{advanced.topK.hint}</span>
			</label>

			<label className="flex flex-col gap-1">
				<span className="flex justify-between font-medium text-(--color-text)">
					{advanced.threshold.label}
					<span className="font-mono">{settings.threshold.toFixed(2)}</span>
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
				<span className="text-xs text-(--color-text)/60">{advanced.threshold.hint}</span>
			</label>

			<button
				type="button"
				onClick={() => onChange({ ...DEFAULT_ASK_CONFIGS })}
				disabled={isDefault}
				className="self-start rounded-full border border-(--color-tertiary) px-3 py-1.5 text-xs font-semibold text-(--color-text) transition hover:border-(--color-accent) hover:text-(--color-accent) disabled:opacity-50 disabled:hover:border-(--color-tertiary) disabled:hover:text-(--color-text)"
			>
				Reset to defaults
			</button>
		</div>
	);
}

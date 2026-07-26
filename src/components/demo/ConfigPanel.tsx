"use client";

interface ConfigItem {
	label: string;
	checked: boolean;
}

interface ConfigPanelProps {
	configurations: ConfigItem[];
	onConfigurationsChange: (configurations: ConfigItem[]) => void;
}

export function ConfigPanel({ configurations, onConfigurationsChange }: ConfigPanelProps) {
	const toggle = (index: number) => {
		onConfigurationsChange(
			configurations.map((item, i) =>
				i === index ? { ...item, checked: !item.checked } : item,
			),
		);
	};

	return (
		<div className="flex shrink-0 flex-col gap-2 rounded-2xl border border-(--color-tertiary) bg-(--color-secondary) p-4 shadow-sm">
			{configurations.map((item, index) => (
				<label
					key={item.label}
					className="flex cursor-pointer items-center gap-2 text-sm text-(--color-text)/80 select-none"
				>
					<input
						type="checkbox"
						checked={item.checked}
						onChange={() => toggle(index)}
						className="accent-(--color-accent)"
					/>
					{item.label}
				</label>
			))}
		</div>
	);
}

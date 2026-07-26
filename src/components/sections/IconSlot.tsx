import Image from "next/image";

interface IconSlotProps {
	icon: string | null;
	alt: string;
}

export function IconSlot({ icon, alt }: IconSlotProps) {
	if (!icon) {
		return (
			<span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-dashed border-(--color-tertiary) bg-(--color-secondary) text-[10px] text-(--color-text)/40">
				icon
			</span>
		);
	}

	return (
		<span className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-(--color-secondary)">
			<Image src={icon} alt={alt} fill className="object-cover" />
		</span>
	);
}

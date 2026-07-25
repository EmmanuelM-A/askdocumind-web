import { ChatAreaPlaceholder } from "@/components/demo/ChatAreaPlaceholder";
import { ConfigAreaPlaceholder } from "@/components/demo/ConfigAreaPlaceholder";
import { DocumentsAreaPlaceholder } from "@/components/demo/DocumentsAreaPlaceholder";

export default function DemoPage() {
	return (
		<div className="mx-auto flex h-[75vh] min-h-[560px] w-full max-w-6xl flex-col gap-4 px-4 py-6 sm:px-6 lg:flex-row">
			<ChatAreaPlaceholder />

			<div className="flex w-full flex-col gap-4 lg:w-80 lg:shrink-0">
				<DocumentsAreaPlaceholder />
				<ConfigAreaPlaceholder />
			</div>
		</div>
	);
}

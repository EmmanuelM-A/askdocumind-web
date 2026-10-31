import Link from "next/link";

export default function NotFound() {
	return (
		<div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 py-24 sm:px-6">
			<h1 className="text-2xl font-semibold tracking-tight text-(--color-text)">
				This page doesn’t exist
			</h1>
			<p className="mt-2 text-sm text-(--color-text)/60">
				It may have moved, or the link is mistyped.{" "}
				<Link href="/" className="font-medium text-(--color-accent) hover:underline">
					Go to the demo
				</Link>
			</p>
		</div>
	);
}

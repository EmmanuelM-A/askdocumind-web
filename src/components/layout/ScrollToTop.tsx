"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function ScrollToTop() {
	const pathname = usePathname();

	// biome-ignore lint/correctness/useExhaustiveDependencies: pathname is only used to trigger a reset on navigation, not read
	useEffect(() => {
		document.getElementById("page-scroll")?.scrollTo({ top: 0 });
	}, [pathname]);

	return null;
}

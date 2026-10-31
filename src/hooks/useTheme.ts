import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export function useTheme() {
	const [theme, setTheme] = useState<Theme>("light");

	useEffect(() => {
		const stored = localStorage.getItem("askdocumindweb-theme");
		const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
		setTheme(stored === "dark" || stored === "light" ? stored : prefersDark ? "dark" : "light");
	}, []);

	useEffect(() => {
		document.documentElement.setAttribute("data-theme", theme);
	}, [theme]);

	const toggleTheme = () => {
		setTheme((prev) => {
			const next = prev === "dark" ? "light" : "dark";
			localStorage.setItem("askdocumindweb-theme", next);
			return next;
		});
	};

	return { theme, toggleTheme };
}

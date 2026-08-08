import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export function useTheme() {
	const [theme, setTheme] = useState<Theme>("light");

	useEffect(() => {
		const stored = (localStorage.getItem("askdocumindweb-theme") as Theme) ?? "light";
		setTheme(stored);
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

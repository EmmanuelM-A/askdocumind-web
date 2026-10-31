"use client";

import { useEffect } from "react";

// Replaces the root layout when it fails, so it renders its own <html>/<body>
// and gets none of globals.css - hence the inline styles.
export default function GlobalError({ error, retry }: { error: unknown; retry: () => void }) {
	useEffect(() => {
		console.error("Unhandled error in root layout", error);
	}, [error]);

	return (
		<html lang="en">
			<body
				style={{
					margin: 0,
					minHeight: "100vh",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					gap: "1rem",
					fontFamily: "system-ui, sans-serif",
					textAlign: "center",
				}}
			>
				<title>Something went wrong | AskDocuMind</title>
				<h1 style={{ margin: 0, fontSize: "1.5rem" }}>Something went wrong</h1>
				<p style={{ margin: 0, opacity: 0.7 }}>
					An unexpected error stopped the page from loading.
				</p>
				<button
					type="button"
					onClick={() => retry()}
					style={{
						padding: "0.75rem 1.5rem",
						border: "none",
						borderRadius: "9999px",
						background: "#2563EB",
						color: "#fff",
						fontWeight: 600,
						cursor: "pointer",
					}}
				>
					Try again
				</button>
			</body>
		</html>
	);
}

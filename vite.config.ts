import { readFileSync } from "node:fs";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const { version } = JSON.parse(readFileSync("./package.json", "utf-8"));

export default defineConfig({
	define: {
		__APP_VERSION__: JSON.stringify(version),
	},
	plugins: [react()],
	resolve: {
		alias: {
			"@": "/src",
		},
	},
});

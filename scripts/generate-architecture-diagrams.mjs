#!/usr/bin/env node
/**
 * Renders every diagrams/architecture/*.mmd source file to an SVG in
 * public/images/architecture/, using the same mermaid-cli invocation the
 * home page diagram was generated with (transparent background, so the SVG
 * sits inside its own rounded container instead of carrying its own box).
 *
 * Usage: npm run generate:architecture-diagrams
 */

import { execFileSync } from "node:child_process";
import { readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const sourceDir = path.join(rootDir, "diagrams", "architecture");
const outDir = path.join(rootDir, "public", "images", "architecture");
const mmdcBin = path.join(
	rootDir,
	"node_modules",
	".bin",
	process.platform === "win32" ? "mmdc.cmd" : "mmdc",
);

const mmdFiles = readdirSync(sourceDir).filter((file) => file.endsWith(".mmd"));

if (mmdFiles.length === 0) {
	console.error(`No .mmd files found in ${sourceDir}`);
	process.exit(1);
}

for (const file of mmdFiles) {
	const inputPath = path.join(sourceDir, file);
	const outputPath = path.join(outDir, `${file.replace(/\.mmd$/, "")}-theme.svg`);

	console.log(`Rendering ${file} -> ${path.relative(rootDir, outputPath)}`);

	const args = ["-i", inputPath, "-o", outputPath, "-b", "transparent", "-w", "1400"];
	const isWin = process.platform === "win32";

	execFileSync(isWin ? `"${mmdcBin}"` : mmdcBin, isWin ? args.map((arg) => `"${arg}"`) : args, {
		stdio: "inherit",
		shell: isWin,
	});
}

console.log(`\nDone. Rendered ${mmdFiles.length} diagrams to ${path.relative(rootDir, outDir)}`);

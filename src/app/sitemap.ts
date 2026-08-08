import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/constants";

export default function sitemap(): MetadataRoute.Sitemap {
	const routes = ["", "/architecture", "/demo", "/feedback", "/privacy", "/terms"];

	return routes.map((route) => ({
		url: `${SITE_URL}${route}`,
		lastModified: new Date(),
	}));
}

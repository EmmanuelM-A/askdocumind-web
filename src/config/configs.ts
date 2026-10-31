/**
 * Configurations and settings for the application.
 */
export const settings = {
	api: {
		ENV: process.env.NEXT_PUBLIC_ENV ?? "development",
		BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "",
		BASE_VERSION: process.env.NEXT_PUBLIC_API_VERSION ?? "1",
	},

	documents: {
		MAX_MB_PER_CHAT: Number(process.env.NEXT_PUBLIC_MAX_FILES_MB_PER_CHAT) || 1,
	},
};

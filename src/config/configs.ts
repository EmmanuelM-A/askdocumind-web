/**
 * Configurations and settings for the application.
 */
export const settings = {
	api: {
		ENV: import.meta.env.VITE_ENV,
		BASE_URL: import.meta.env.VITE_ASK_DOCU_MIND_API_BASE_URL,
		BASE_VERSION: import.meta.env.VITE_ASK_DOCU_MIND_API_VERSION ?? "1",
		IS_WEB_SEARCH_ENABLED: Boolean(import.meta.env.VITE_WEB_SEARCH_ENABLED === "true") ?? false,
	},

	documents: {
		MAX_MB_PER_CHAT: Number(import.meta.env.VITE_MAX_FILES_MB_PER_CHAT) || 1,
	},
};

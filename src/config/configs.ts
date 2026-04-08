/**
 * Configurations and settings for the application.
 */
export const settings = {
    "server": {
        NODE_ENV: String(import.meta.env.NODE_ENV),
        VITE_APP_PORT: Number(import.meta.env.VITE_APP_PORT),
        VITE_APP_BASE_URL: String(import.meta.env.VITE_APP_BASE_URL),
        VITE_APP_TITLE: String(import.meta.env.VITE_APP_TITLE)
    },

    "api": {
        BASE_URL: import.meta.env.DOCU_CHAT_API_BASE_URL ?? "",
        BASE_VERSION: import.meta.env.DOCU_CHAT_API_VERSION ?? "",
        IS_WEB_SEARCH_ENABLED: Boolean(import.meta.env.DOCU_CHAT_API_ENABLED === "true") ?? false,
    }
}
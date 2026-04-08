/**
 * Configurations and settings for the application.
 */
export const settings = {
    // TODO: ADD ENVS TO .env
    "server": {
        NODE_ENV: String(import.meta.env.NODE_ENV),
        VITE_APP_PORT: Number(import.meta.env.VITE_APP_PORT),
        VITE_APP_BASE_URL: String(import.meta.env.VITE_APP_BASE_URL),
        VITE_APP_TITLE: String(import.meta.env.VITE_APP_TITLE)
    },

    "api": {
        BASE_URL: import.meta.env.DOCU_CHAT_API_BASE_URL ?? "",
        BASE_VERSION: import.meta.env.DOCU_CHAT_API_VERSION ?? "1",
        IS_WEB_SEARCH_ENABLED: Boolean(import.meta.env.DOCU_CHAT_API_ENABLED === "true") ?? false,
    },

    "documents": {
        MAX_MB_PER_CHAT: Number(import.meta.env.MAX_MB_PER_CHAT) || 10,
    }
}
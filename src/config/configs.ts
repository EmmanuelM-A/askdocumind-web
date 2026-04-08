/**
 * Configurations and settings for the application.
 */
export const settings = {
    // TODO: ADD ENVS TO .env
    "server": {
        VITE_ENV: String(import.meta.env.VITE_ENV),
        VITE_APP_PORT: Number(import.meta.env.VITE_APP_PORT),
        VITE_APP_BASE_URL: String(import.meta.env.VITE_APP_BASE_URL),
        VITE_APP_TITLE: String(import.meta.env.VITE_APP_TITLE)
    },

    "api": {
        BASE_URL: import.meta.env.VITE_DOCU_CHAT_API_BASE_URL,
        BASE_VERSION: import.meta.env.VITE_DOCU_CHAT_API_VERSION ?? "1",
        IS_WEB_SEARCH_ENABLED: Boolean(import.meta.env.VITE_DOCU_CHAT_API_ENABLED === "true") ?? false,
    },

    "documents": {
        MAX_MB_PER_CHAT: Number(import.meta.env.VITE_MAX_MB_PER_CHAT) || 10,
    }
}
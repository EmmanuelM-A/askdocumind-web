/**
 * Configurations and settings for the application.
 */
export const settings = {
    "server": {
        VITE_APP_PORT: Number(import.meta.env.VITE_APP_PORT),
        VITE_APP_BASE_URL: String(import.meta.env.VITE_APP_BASE_URL),
        VITE_APP_TITLE: String(import.meta.env.VITE_APP_TITLE)
    },

    "api": {
        BASE_URL: String(import.meta.env.DOCU_CHAT_API_BASE_URL),
        BASE_VERSION: String(import.meta.env.DOCU_CHAT_API_VERSION)
    }
}
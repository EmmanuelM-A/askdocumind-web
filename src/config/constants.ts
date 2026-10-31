export const SITE_URL = "https://askdocumind.com";
export const SITE_NAME = "AskDocuMind";

export const API_ROUTES = {
	AUTH_INIT: "v1/auth/anonymous/init",
	CHAT_SESSIONS: "v1/chat-session",
	UPLOADS: "v1/uploads",
	CHATBOT: "v1/chatbot",
} as const;

export const UPLOAD_LIMITS = {
	MAX_FILE_SIZE_BYTES: 10 * 1024 * 1024,
	MAX_DOCUMENTS_PER_CHAT: 10,
	MIME_TYPES: {
		".pdf": "application/pdf",
		".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		".txt": "text/plain",
		".md": "text/markdown",
		".html": "text/html",
		".py": "text/x-python",
		".js": "text/javascript",
		".jsx": "text/plain",
		".ts": "text/plain",
		".tsx": "text/plain",
		".java": "text/x-java-source",
		".go": "text/plain",
	},
} as const;

export const MAX_QUERY_LENGTH = 2000;

export const DEFAULT_ASK_CONFIGS = {
	topK: 15,
	threshold: 0.35,
	webSearchEnabled: false,
} as const;

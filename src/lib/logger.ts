import pino from "pino";
import { settings } from "@/config/configs";

const isDev = settings.api.ENV === "development";
const isServer = typeof window === "undefined";

export const logger = pino({
	level: isDev ? "debug" : "warn",
	...(isServer
		? {}
		: {
				browser: {
					asObject: false,
				},
			}),
});

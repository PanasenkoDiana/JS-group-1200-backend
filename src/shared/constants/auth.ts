import { ROUTES } from "./routes.js";

export const AUTH_COOKIE = {
	ACCESS: "accessToken",
	REFRESH: "refreshToken",
} as const;

export const REFRESH_COOKIE_PATH = ROUTES.AUTH;

// Створено новий файл який відповідає за роботу с кукі

import type { CookieOptions, Request, Response } from "express";
import { config } from "../../config.js";
import type { AuthTokens } from "../../services/auth/auth.types.js";
import { AUTH_COOKIE, AUTH_COOKIE_PATH } from "../../shared/constants/auth.js";

const base: CookieOptions = { httpOnly: true, sameSite: "lax" };
const access: CookieOptions = { ...base, path: "/" };
const refresh: CookieOptions = { ...base, path: AUTH_COOKIE_PATH };

export function setAuthCookies(res: Response, tokens: AuthTokens): void {
	res.cookie(AUTH_COOKIE.ACCESS, tokens.accessToken, {
		...access,
		maxAge: config.jwt.accessTtlMs,
	});
	res.cookie(AUTH_COOKIE.REFRESH, tokens.refreshToken, {
		...refresh,
		maxAge: config.jwt.refreshTtlMs,
	});
}

export function clearAuthCookies(res: Response): void {
	res.clearCookie(AUTH_COOKIE.ACCESS, access);
	res.clearCookie(AUTH_COOKIE.REFRESH, refresh);
}

export function readAccessToken(req: Request): string | undefined {
	const token: unknown = req.cookies?.[AUTH_COOKIE.ACCESS];
	return typeof token === "string" ? token : undefined;
}

export function readRefreshToken(req: Request): string | undefined {
	const token: unknown = req.cookies?.[AUTH_COOKIE.REFRESH];
	return typeof token === "string" ? token : undefined;
}

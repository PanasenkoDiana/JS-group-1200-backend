import type { RequestHandler } from "express";
import type { TokenService } from "../../services/auth/auth.types";
import { readAccessToken } from "../cookies/auth-cookies";

export function createRequireAuth(
	// Змінено передачу функції перевірки access-токена на передачу всього сервісу токенів TokenService.
	tokens: TokenService,
): RequestHandler {
	return (req, res, next) => {
		// Змінено отримання access-токена: замість прямого читання cookies використовується функция readAccessToken().
		const token = readAccessToken(req);
		if (typeof token !== "string") {
			res.status(401).json({ message: "Unauthorized" });
			return;
		}
		try {
			// Змінено перевірку access-токена: замість окремої функції verifyAccessToken используется метод verifyAccess() сервісу tokens.
			res.locals.userId = tokens.verifyAccess(token);
			next();
		} catch {
			res.status(401).json({ message: "Unauthorized" });
		}
	};
}

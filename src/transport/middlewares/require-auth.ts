import type { RequestHandler } from "express";
import { readAccessToken } from "../cookies/auth-cookies";
import type { TokenService } from "../../services/auth/auth.types";

export function createRequireAuth(
	tokens: TokenService
): RequestHandler
{
	return (req, res, next) => {
		const token = readAccessToken(req)
		if (typeof token !== "string") {
			res.status(401).json({ message: "Unauthorized" });
			return;
		}
		try {
			res.locals.userId = tokens.verifyAccess(token);
			next();
		} catch {
			res.status(401).json({ message: "Unauthorized" });
		}
	};
}

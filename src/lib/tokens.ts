import { createHash, randomUUID } from "node:crypto";
import jwt from "jsonwebtoken";
import type { TokenService } from "../services/auth/auth.types.js";

type TokenKind = "access" | "refresh";

export interface TokenServiceOptions {
	accessSecret: string;
	refreshSecret: string;
	accessTtlMs: number;
	refreshTtlMs: number;
}

export function createTokenService(options: TokenServiceOptions): TokenService {
	function sign(
		userId: number,
		type: TokenKind,
		secret: string,
		ttlMs: number,
	): string {
		return jwt.sign({ type }, secret, {
			algorithm: "HS256",
			subject: String(userId),
			// Указываем время жизни токена.
			// ttlMs хранится в миллисекундах, а jsonwebtoken ожидает секунды.
			// Делим на 1000 и округляем результат вниз до целого числа.
			expiresIn: Math.floor(ttlMs / 1000),
			jwtid: randomUUID(),
		});
	}

	function verify(
		token: string,
		type: TokenKind,
		secret: string,
		errorCode: string,
	): number {
		try {
			const data = jwt.verify(token, secret, { algorithms: ["HS256"] });
			if (
				typeof data === "string" ||
				data.type !== type ||
				typeof data.sub !== "string"
			)
				throw new Error();
			const userId = Number(data.sub);
			if (!Number.isSafeInteger(userId) || userId <= 0) throw new Error();
			return userId;
		} catch {
			throw new Error(errorCode);
		}
	}

	return {
		signAccess: (id: number) =>
			sign(id, "access", options.accessSecret, options.accessTtlMs),
		signRefresh: (id: number) =>
			sign(id, "refresh", options.refreshSecret, options.refreshTtlMs),
		verifyAccess: (token: string) =>
			verify(token, "access", options.accessSecret, "INVALID_ACCESS_TOKEN"),
		verifyRefresh: (token: string) =>
			verify(token, "refresh", options.refreshSecret, "INVALID_REFRESH_TOKEN"),
		hash: (token: string) => createHash("sha256").update(token).digest("hex"),
	};
}

import { createHash, randomUUID } from "node:crypto";
import jwt from "jsonwebtoken";
import type { TokenService } from "../services/auth/auth.types";

type TokenKind = "access"|"refresh"

export interface TokenServiceOptions {
	accessSecret: string,
	refreshSecret: string,
	accessTlMs: number,
	refreshTlMs: number
}

export function createTokenService(options: TokenServiceOptions):TokenService{
	function sign(userId: number, type: TokenKind, secret: string, time: number){
		return jwt.sign({ type}, secret,{
			algorithm: "HS256",
			subject: String(userId),
			expiresIn: Math.floor(time / 1000),
			jwtid: randomUUID()
		})
	}
	function verify(token: string, type: TokenKind, secret: string, errorCode: string): number{
		try{
			const payload = jwt.verify(token, secret, {
			algorithms: ["HS256"],
			});
			if (typeof payload === "string" || typeof payload.sub !== "string") {
				throw new Error();
			}
			const userId = Number(payload.sub);
			if (!Number.isSafeInteger(userId) || userId <= 0) {
				throw new Error();
			}
			return userId;
		} catch {
			throw new Error(errorCode);
		}
	}	
	return 	{
		signAccess: (id:number)=>sign(id, "access", options.accessSecret, options.accessTlMs),
		signRefresh: (id:number)=>sign(id, "refresh", options.refreshSecret, options.refreshTlMs),
		verifyAccess: (token: string) => verify(token, 'access', options.accessSecret, 'INVALID_ACCESS_TOKEN'),
		verifyRefresh: (token: string) => verify(token, 'refresh', options.refreshSecret, 'INVALID_REFRESH_TOKEN'),
		hash: (token: string) => createHash('sha256').update(token).digest('hex')
	}	
}

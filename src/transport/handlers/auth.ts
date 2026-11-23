import type { Request, Response } from "express";
import type {
	AuthService,
	AuthTokens,
} from "../../services/auth/auth.types.js";
import type { AuthCredentialRequest } from "../dto/auth/requests.js";
import { read } from "node:fs";
import { clearAuthCookies, readRefreshToken, setAuthCookies } from "../cookies/auth-cookies.js";

export interface AuthHandlers {
	register(
		req: Request<{}, {}, AuthCredentialRequest>,
		res: Response,
	): Promise<void>;
	login(
		req: Request<{}, {}, AuthCredentialRequest>,
		res: Response,
	): Promise<void>;
	refresh(req: Request, res: Response): Promise<void>;
	me(req: Request, res: Response): Promise<void>;
	logout(req: Request, res: Response): Promise<void>;
}

export function createAuthHandlers(service: AuthService): AuthHandlers {
	return {
		async register(req, res) {
			try {
				const { email, password } = req.body;
				const user = await service.register({ email, password });
				res.status(201).json(user);
			} catch (error) {
				if (
					error instanceof Error &&
					error.message === "EMAIL_ALREADY_EXISTS"
				) {
					res.status(409).json({ message: "Email already exists" });
					return;
				}
				console.error(error);
				res.status(500).json({ message: "Internal server error" });
			}
		},

		async login(req, res) {
			try {
				const { email, password } = req.body;
				const result = await service.login({ email, password });
				setAuthCookies(res, result);
				res.status(200).json({ user: result.user });
			} catch (error) {
				if (error instanceof Error && error.message === "INVALID_DATA") {
					res.status(401).json({ message: "Invalid credentials" });
					return;
				}
				console.error(error);
				res.status(500).json({ message: "Internal server error" });
			}
		},
		async refresh(req, res) {
			const token = readRefreshToken(req)

			if (typeof token !== "string") {
				res.status(401).json({ message: "Unauthorized" });
				return;
			}

			try {
				const tokens = await service.refresh(token);

				setAuthCookies(res, tokens);

				res.status(200).json({ message: "Tokens updated" });
			} catch (error) {
				if (
					error instanceof Error &&
					error.message === "INVALID_REFRESH_TOKEN"
				) {
					res.status(401).json({ message: "Unauthorized" });
					return;
				}
				console.error(error);
				res.status(500).json({ message: "Internal server error" });
			}
		},
		async me(req, res) {
			try {
				const userId: number = res.locals.userId;
				const user = await service.me(userId);
				res.status(200).json(user);
			} catch (error) {
				if (error instanceof Error && error.message === "UNAUTHORIZED") {
					res.status(401).json({ message: "Unauthorized" });
					return;
				}
				console.error(error);
				res.status(500).json({ message: "Internal server error" });
			}
		},
		async logout(req, res) {
			try {
				// Получаем refresh-токен из cookies пользователя
				const token = readRefreshToken(req)

				// Вызываем метод logout и передаём токен,
				// если он является строкой, иначе передаём undefined
				await service.logout(typeof token === "string" ? token : undefined);

				// Удаляем access-токен из cookies
				clearAuthCookies(res)

				// Отправляем ответ об успешном выходе из аккаунта
				res.status(200).json({ message: "Logged out" });
			} catch (error) {
				// Выводим информацию об ошибке в консоль сервера
				console.error(error);

				// Отправляем клиенту ошибку сервера
				res.status(500).json({ message: "Internal server error" });
			}
		},
	};
}

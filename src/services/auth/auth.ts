import type { RefreshSessionRepository } from "../../domain/refresh-session/repository.js";
import type { UserRepository } from "../../domain/user/repository.js";
import type {
	AuthService,
	AuthServiceDeps,
	PasswordHasher,
	RefreshTokenHasher,
} from "./auth.types.js";

export function createAuthService({
	users,
	sessions,
	passwords,
	tokens,
	refreshTtlMs,
}: AuthServiceDeps): AuthService {
	return {
		async register(input) {
			const email = input.email.trim().toLowerCase();
			const passwordHash = await passwords.hash(input.password);
			const user = await users.createUser({ email, passwordHash });
			return {
				id: user.id,
				email: user.email,
			};
		},
		async login(input) {
			const email = input.email.trim().toLowerCase();
			const user = await users.getByEmail(email);
			if (
				!user ||
				!(await passwords.verify(user.passwordHash, input.password))
			) {
				throw new Error("INVALID_DATA");
			}

			const refreshToken = tokens.signRefresh(user.id);
			await sessions.create({
				userId: user.id,
				tokenHash: tokens.hash(refreshToken),
				expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
			});
			return {
				user: {
					id: user.id,
					email: user.email,
				},
				accessToken: tokens.signAccess(user.id),
				refreshToken,
			};
		},
		async refresh(refreshToken) {
			const userId = tokens.verifyRefresh(refreshToken);
			const oldHash = tokens.hash(refreshToken);
			const session = await sessions.getByHash(oldHash);
			if (
				!session ||
				session.userId !== userId ||
				session.expiresAt <= new Date()
			) {
				throw new Error("INVALID_REFRESH_TOKEN");
			}

			const user = await users.getById(userId);
			if (!user) throw new Error("INVALID_REFRESH_TOKEN");

			// Создаём новый refresh-токен для пользователя
			const newRefreshToken = tokens.signRefresh(userId);

			// Обновляем существующую сессию в базе данных
			const changed = await sessions.rotate(
				oldHash, // Хеш старого refresh-токена, по которому ищем сессию
				tokens.hash(newRefreshToken), // Хеш нового токена, который заменит старый
				new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Новый срок действия сессии — 7 дней
			);

			// Если сессию не удалось обновить, считаем refresh-токен недействительным
			if (!changed) throw new Error("INVALID_REFRESH_TOKEN");
			return {
				accessToken: tokens.signAccess(user.id),
				refreshToken: newRefreshToken,
			};
		},
		async logout(refreshToken) {
			if (!refreshToken) return;
			await sessions.deleteByHash(tokens.hash(refreshToken));
		},

		async me(userId) {
			const user = await users.getById(userId);
			if (!user) throw new Error("UNAUTHORIZED");
			return {
				id: user.id,
				email: user.email,
			};
		},
	};
}

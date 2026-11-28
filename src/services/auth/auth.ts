import type { RefreshSessionRepository } from "../../domain/refresh-session/repository.js";
import type { UserRepository } from "../../domain/user/repository.js";

import type {
	AuthService,
	AuthServiceDeps,
	PasswordHasher,
	refreshTokenHasher,
} from "./auth.types.js";

// Оновлено шапку для функції сервісу
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
			// Змінено звернення до паролей passwordHasher -> passwords
			const passwordHash = await passwords.hash(input.password);
			// Змінено repository -> users
			const user = await users.createUser({ email, passwordHash });
			return {
				id: user.id,
				email: user.email,
			};
		},
		async login(input) {
			const email = input.email.trim().toLowerCase();
			// Змінено звернення до репозиторію користувачів repository -> users.
			const user = await users.getByEmail(email);
			if (
				!user ||
				// Змінено звернення до сервісу перевірки пароля passwordHasher -> passwords.
				!(await passwords.verify(user.passwordHash, input.password))
			) {
				throw new Error("INVALID_DATA");
			}
			// Додано створення refresh-токена через tokens.signRefresh().
			// Токен створюється окремо, щоб його можна було зберегти в базі даних.
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
				// Змінено назву сервісу створення токенів tokenSign -> tokens.
				// Змінено назву методу створення access-токена signAccessToken -> signAccess.
				// Змінено повернення refresh-токена: тепер він створюється окремо та зберігається в змінній refreshToken.
				accessToken: tokens.signAccess(user.id),
				refreshToken,
			};
		},
		async refresh(refreshToken) {
			// Змінено tokenVerify.verifyRefreshToken -> tokens.verifyRefresh
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
			// Змінено repository -> users
			const user = await users.getById(userId);
			if (!user) throw new Error("INVALID_REFRESH_TOKEN");
			// Змінено tokenSign.signRefreshToken -> tokens.signRefresh
			const newRefreshToken = tokens.signRefresh(userId);
			const changedToken = await sessions.rotate(
				oldHash,
				tokens.hash(newRefreshToken),
				new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
			);
			if (!changedToken) throw new Error("INVALID_REFRESH_TOKEN");
			return {
				// tokenSign.signAccessToken -> tokens.signAccess
				accessToken: tokens.signAccess(user.id),
				refreshToken: newRefreshToken,
			};
		},
		async me(userId) {
			// Змінено repository -> users
			const user = await users.getById(userId);
			if (!user) throw new Error("UNAUTHORIZED");
			return {
				id: user.id,
				email: user.email,
			};
		},

		async logout(refreshToken) {
			if (!refreshToken) return;
			await sessions.deletedByHash(tokens.hash(refreshToken));
		},
	};
}

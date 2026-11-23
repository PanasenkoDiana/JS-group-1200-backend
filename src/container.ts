import type { Config } from "./config";
import { createPasswordHasher } from "./lib/password";
import { createTokenService } from "./lib/tokens";
import { createDb } from "./prisma/db";
import { createProductRepository } from "./repositories/product";
import { createRefreshSessionRepository } from "./repositories/refresh-session";
import { createUserRepository } from "./repositories/user";
import { createAuthService } from "./services/auth/auth";
import { createProductService } from "./services/product";
import { createAuthHandlers } from "./transport/handlers/auth";
import { createProductHandler } from "./transport/handlers/product";
import { createRequireAuth } from "./transport/middlewares/require-auth";
import { createAuthRouter } from "./transport/routers/auth";
import { createProductRouter } from "./transport/routers/product";

export function createContainer(config: Config) {
	const db = createDb(config.databaseUrl);
	const users = createUserRepository(db);
	const sessions = createRefreshSessionRepository(db);
	const passwords = createPasswordHasher(config.passwordPepper);
	const tokens = createTokenService(config.jwt);
	const auth = createAuthService({
		users,
		sessions,
		passwords,
		tokens,
		refreshTtlMs: config.jwt.refreshTtlMs,
	});
	const requireAuth = createRequireAuth(tokens);

	const productRouter = createProductRouter(
		createProductHandler(createProductService(createProductRepository(db))),
	);
	const authRouter = createAuthRouter(createAuthHandlers(auth), requireAuth);

	return {
		routers: {
			product: productRouter,
			auth: authRouter,
		},
	};
}


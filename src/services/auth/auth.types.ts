import type { RefreshSessionRepository } from "../../domain/refresh-session/repository";
import type { PublicUser } from "../../domain/user/entity";
import type { UserRepository } from "../../domain/user/repository";
export interface AuthInput {
	email: string;
	password: string;
}

export interface PasswordHasher {
	hash(password: string): Promise<string>;
	verify(password: string, hash: string): Promise<boolean>;
}

export interface TokenService {
	signAccess(userId: number): string;
	signRefresh(userId: number): string;
	verifyAccess(token: string): number;
	verifyRefresh(token: string): number;
	hash(token: string): string;
}

export interface AuthTokens {
	accessToken: string;
	refreshToken: string;
}

// Додано новий інтерфейс який описує усі залежності серверу для користувача
export interface AuthServiceDeps {
	users: UserRepository;
	sessions: RefreshSessionRepository;
	passwords: PasswordHasher;
	tokens: TokenService;
	refreshTtlMs: number;
}

export interface AuthService {
	register(input: AuthInput): Promise<PublicUser>;
	login(input: AuthInput): Promise<{ user: PublicUser } & AuthTokens>;
	refresh(refreshToken: string): Promise<AuthTokens>;
	me(userId: number): Promise<PublicUser>;
	logout(refreshToken?: string): Promise<void>;
}

export interface refreshTokenHasher {
	hash(token: string): string;
}

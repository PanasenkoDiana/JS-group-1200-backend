import type { PublicUser } from "../../domain/user/entity";
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

import type { PublicUser } from "../../domain/user/entity";
export interface AuthInput {
    email: string , 
    password: string
}

export interface PasswordHasher {
    hash(password: string): Promise<string> , 
    verify(password: string, hash: string):  Promise<boolean>
}

export interface TokenSign {
    signAccessToken(userId: number): string
    signRefreshToken(userId: number): string
}

export interface TokenVerify{
    verifyRefreshToken(token: string): number
}

export interface AuthTokens{
    accessToken: string
    refreshToken: string
}

export interface AuthService {
    register(input: AuthInput): Promise<PublicUser> 
    login(input: AuthInput): Promise<{user: PublicUser} & AuthTokens>
    refresh(refreshToken: string): Promise<AuthTokens>
    me(userId: number): Promise<PublicUser>
}
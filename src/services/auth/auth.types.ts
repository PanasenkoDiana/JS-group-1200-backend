// імпортуємо тип PublicUser з файлу entity.ts
import type { PublicUser } from "../../domain/user/entity";
// створюємо інтерфейс AuthInput, який містить email та password
export interface AuthInput {
    email: string , 
    password: string
}
// створюємо інтерфейс PasswordHasher, який містить методи hash та verify
export interface PasswordHasher {
    hash(password: string): Promise<string> , 
    verify(password: string, hash: string):  Promise<boolean>
}
// створюємо інтерфейс TokenSign, який містить методи signAccessToken та signRefreshToken
export interface TokenSign {
    signAccessToken(userId: number): string
    signRefreshToken(userId: number): string
}
// створюємо інтерфейс TokenVerify, який містить метод verifyRefreshToken
export interface TokenVerify{
    verifyRefreshToken(token: string): number
}
// створюємо інтерфейс AuthTokens, який містить accessToken та refreshToken
export interface AuthTokens{
    accessToken: string
    refreshToken: string
}
// створюємо інтерфейс AuthService, який містить методи register, login, refresh та me
export interface AuthService {
    register(input: AuthInput): Promise<PublicUser> 
    login(input: AuthInput): Promise<{user: PublicUser} & AuthTokens>
    refresh(refreshToken: string): Promise<AuthTokens>
    me(userId: number): Promise<PublicUser>
}
import type { PublicUser } from "../../domain/user/entity";

// Данные для входа/регистрации
export interface AuthInput {
    email: string , 
    password: string
}

// Хэширование паролей
export interface PasswordHasher {
    hash(password: string): Promise<string> , 
    verify(password: string, hash: string):  Promise<boolean>
}

// Подпись токенов
export interface TokenSign {
    signAccessToken(userId: number): string
    signRefreshToken(userId: number): string
}

// Проверка токенов
export interface TokenVerify{
    verifyRefreshToken(token: string): number
}

// Пара токенов
export interface AuthTokens{
    accessToken: string
    refreshToken: string
}

// Интерфейс auth сервиса
export interface AuthService {
    register(input: AuthInput): Promise<PublicUser> 
    login(input: AuthInput): Promise<{user: PublicUser} & AuthTokens>
    refresh(refreshToken: string): Promise<AuthTokens>
    me(userId: number): Promise<PublicUser>
}
import type { PublicUser } from "../../domain/user/entity";
// форма для регестрації та логину
export interface AuthInput {
    email: string , 
    password: string
}
// інтерфейс для хешування паролей
export interface PasswordHasher {
    // хешування пароля
    hash(password: string): Promise<string> , 
    verify(password: string, hash: string):  Promise<boolean>
}
// інтерфейс для токену
export interface TokenSign {
    signAccessToken(userId: number): string
}
//контракт авторизації
export interface AuthService {
    // регестрация
    register(input: AuthInput): Promise<PublicUser>
    // логін
    login(input: AuthInput): Promise<{
        user: PublicUser 
        accessToken: string
    }>
}
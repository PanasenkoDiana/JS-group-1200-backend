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
}

export interface AuthService {
    register(input: AuthInput): Promise<PublicUser>
    login(input: AuthInput): Promise<{
        user: PublicUser 
        accessToken: string
    }>
}
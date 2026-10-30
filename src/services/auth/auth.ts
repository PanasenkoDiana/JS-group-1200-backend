import type { UserRepository } from "../../domain/user/repository.js"

import type { AuthService, PasswordHasher, TokenSign, TokenVerify } from "./auth.types.js"

// Создание сервиса авторизации
export function createAuthService(
    repository: UserRepository,
    passwordHasher: PasswordHasher,
    tokenSign: TokenSign,
    tokenVerify: TokenVerify
): AuthService{
    return{
     // Регистрация нового юзера
     async register(input){
        const email = input.email.trim().toLowerCase()
        const passwordHash = await passwordHasher.hash(input.password)
        const user = await repository.createUser({email, passwordHash})
        return{
            id: user.id,
            email: user.email
        }
     },
     // Вход в аккаунт
     async login(input){
        const email = input.email.trim().toLowerCase()
        const user = await repository.getByEmail(email)
        if(
            !user||!await passwordHasher.verify(user.passwordHash, input.password)
        ){throw new Error("INVALID_DATA")}
        return{
            user:{
                id: user.id,
                email: user.email
            },
            accessToken: tokenSign.signAccessToken(user.id),
            refreshToken: tokenSign.signRefreshToken(user.id)
        }   
     }, 
     // Обновление токенов
     async refresh(refreshToken) {
        const userId = tokenVerify.verifyRefreshToken(refreshToken)
        const user = await repository.getById(userId)
        if (!user) throw new Error("INVALID_REFRESH_TOKEN")
        return{
            accessToken: tokenSign.signAccessToken(user.id),
            refreshToken: tokenSign.signRefreshToken(user.id)
        }
     },
     // Получение информации о себе
     async me(userId) {
        const user = await repository.getById(userId)
        if (!user) throw new Error("UNAUTHORIZED")
        return{
            id: user.id,
            email: user.email
        }
     }
    }
}
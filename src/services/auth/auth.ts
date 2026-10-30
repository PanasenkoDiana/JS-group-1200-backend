// імпортуємо тип UserRepository з файлу repository.ts
import type { UserRepository } from "../../domain/user/repository.js"
// імпортуємо типи AuthService, PasswordHasher, TokenSign та TokenVerify з файлу auth.types.ts
import type { AuthService, PasswordHasher, TokenSign, TokenVerify } from "./auth.types.js"
// створюємо функцію createAuthService, яка приймає параметри repository, passwordHasher, tokenSign та tokenVerify
export function createAuthService(
    repository: UserRepository,
    passwordHasher: PasswordHasher,
    tokenSign: TokenSign,
    tokenVerify: TokenVerify
): AuthService{
    return{
    //  метод register, який приймає змінні email password та user
    async register(input){
        // отримуємо email та password, прибираємо пробіли та перетворюємо email на нижній регістр
        const email = input.email.trim().toLowerCase()
        // хешуємо пароль за допомогою passwordHasher
        const passwordHash = await passwordHasher.hash(input.password)
        const user = await repository.createUser({email, passwordHash})
        return{
            id: user.id,
            email: user.email
        }
     },
    //  метод login, який приймає змінні email та password
     async login(input){
        const email = input.email.trim().toLowerCase()
        const user = await repository.getByEmail(email)
        // якщо користувача не існує або пароль не збігається з хешем, виводимо помилку "INVALID_DATA"
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
    //  метод refresh, який приймає змінну refreshToken
     async refresh(refreshToken) {
        // перевіряємо токен за допомогою tokenVerify та отримуємо userId
        const userId = tokenVerify.verifyRefreshToken(refreshToken)
        const user = await repository.getById(userId)
        // якщо користувача не існує, виводимо помилку "INVALID_REFRESH_TOKEN
        if (!user) throw new Error("INVALID_REFRESH_TOKEN")
        return{
            accessToken: tokenSign.signAccessToken(user.id),
            refreshToken: tokenSign.signRefreshToken(user.id)
        }
     },
    //  метод me, який приймає змінну userId
     async me(userId) {
        const user = await repository.getById(userId)
        // якщо користувача не існує, виводимо помилку "UNAUTHORIZED"
        if (!user) throw new Error("UNAUTHORIZED")
        return{
            id: user.id,
            email: user.email
        }
     }
    }
} 

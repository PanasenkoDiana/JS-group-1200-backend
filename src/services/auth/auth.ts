import type { UserRepository } from "../../domain/user/repository.js"

import type { AuthService, PasswordHasher, TokenSign } from "./auth.types.js"

// хеш паролей та генератор токенів
export function createAuthService(
    repository: UserRepository,
    passwordHasher: PasswordHasher,
    tokenSign: TokenSign
): AuthService{
    return{
    // регістрация нового юзера
     async register(input){
        // прибираємо с email пробіли і переводимо в ніжний регистр
        const email = input.email.trim().toLowerCase()
        // хешуем пароль перед збереженням
        const passwordHash = await passwordHasher.hash(input.password)
        // зберігаємо нового юзера
        const user = await repository.createUser({email, passwordHash})
    
        return{
            id: user.id,
            email: user.email
        }
     },
     // вхід для зарегестрованого юзера
     async login(input){
        const email = input.email.trim().toLowerCase()
        // шукаємо юзера за поштою в БД
        const user = await repository.getByEmail(email)
        // еревиряємо чи є юзер у БД
        if(
            !user||!await passwordHasher.verify(user.passwordHash, input.password)
        ){throw new Error("INVALID_DATA")}
        // якщо юзер є повертаємо юзера
        return{
            user:{
                id: user.id,
                email: user.email
            },
            accessToken: tokenSign.signAccessToken(user.id)
        }   
     }
    }
} 

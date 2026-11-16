import type { RefreshSessionRepository } from "../../domain/refresh-session/repository.js"
import type { UserRepository } from "../../domain/user/repository.js"

import type { AuthService, PasswordHasher, refreshTokenHasher, TokenSign, TokenVerify } from "./auth.types.js"

export function createAuthService(
    repository: UserRepository,
    passwordHasher: PasswordHasher,
    tokenSign: TokenSign,
    tokenVerify: TokenVerify,
    sessions: RefreshSessionRepository,
    tokens: refreshTokenHasher
): AuthService{
    return{
     async register(input){
        const email = input.email.trim().toLowerCase()
        const passwordHash = await passwordHasher.hash(input.password)
        const user = await repository.createUser({email, passwordHash})
        return{
            id: user.id,
            email: user.email
        }
     },
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
     async refresh(refreshToken) {
        const userId = tokenVerify.verifyRefreshToken(refreshToken)
        const oldHash = tokens.hash(refreshToken)
        const session = await sessions.getByHash(oldHash)
        if (!session || session.userId !== userId || session.expiresAt <= new Date()) {
            throw new Error("INVALID_REFRESH_TOKEN")           
        }  
        const user = await repository.getById(userId)
        if (!user) throw new Error("INVALID_REFRESH_TOKEN")
        const newRefreshToken = tokenSign.signRefreshToken(userId)
        const changedToken = await sessions.rotate(
            oldHash,
            tokens.hash(newRefreshToken),
            new Date(Date.now() +7*24*60*60*1000)
        )
        if (!changedToken) throw new Error("INVALID_REFRESH_TOKEN")
        return{
            accessToken: tokenSign.signAccessToken(user.id),
            refreshToken: newRefreshToken
        }
        
     },
     async me(userId) {
        const user = await repository.getById(userId)
        if (!user) throw new Error("UNAUTHORIZED")
        return{
            id: user.id,
            email: user.email
        }
     },

     async logout(refreshToken) {
        if (!refreshToken) return
        await sessions.deletedByHash(tokens.hash(refreshToken))
     }

    }
} 

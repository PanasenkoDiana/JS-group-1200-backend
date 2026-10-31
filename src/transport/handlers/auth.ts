import type {Request, Response} from "express"
import type { AuthService } from "../../services/auth/auth.types"
import type { AuthCredentialRequest } from "../dto/auth/requests"

export interface AuthHandler{
    register(
        req: Request<{}, {}, AuthCredentialRequest>,
        res: Response
    ): Promise<void>
    login(
        req: Request<{}, {}, AuthCredentialRequest>,
        res: Response
    ): Promise<void>
}
export function createAuthHandler(service: AuthService):AuthHandler{
    return{
        async register(req, res){
            try{
                const {email, password} = req.body
                const user = await service.register({email, password})
                res.status(201).json(user)
            }
            catch(error){
                if(error instanceof Error && error.message === "EMAIL_ALREADY_EXISTS"){
                    res.status(409).json({message: "EMAIL_ALREADY_EXISTS"})
                }
                console.error(error)
                res.status(500).json({message: "INTERNAL_SERVER_ERROR"})
                
            }
        },
        async login(req, res){
            try{
                const {email, password} = req.body
                const result = await service.login({email, password})
                // Встановлення cookie з access token на 15 хвилин
                res.cookie("accessToken", result.accessToken, {
                    // Захист від доступа через js
                    httpOnly: true,
                    // Передача тільки по http у production
                    secure: process.env.NODE_ENV === "production",
                    // Обмеження відправки cross-сайтових запитів
                    sameSite: "lax",
                    // Час життя cookie у мілісекундах
                    maxAge: 15*60*1000,
                    // Шлях по котрому є доступ до cookie
                    path: "/"
                })

                res.status(200).json({user: result.user})
            }
            catch(error){
                if (error instanceof Error && error.message === "INVALID_DATA"){
                    res.status(401).json({message: 'invalid data'})
                    return
                }
                console.error(error)
                res.status(500).json({message: "INTERNAL_SERVER_ERROR"})
            }
        }
    }
}
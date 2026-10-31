import type { RequestHandler } from "express";

// приймає функцію валідації токена щоб не привязувати до JWT
export function createRequireAuth(
    verifyAccessToken: (token: string)=> number
): RequestHandler{
    return (req, res, next)=>{
        // дістаємо токен з кукі
        const token = req.cookies?.accessToke
        // якщо нема кукі або не некоретній тип то повернемо 401
        if (typeof token !== "string"){
            res.status(401).json({message: "Unauthorized"})
            return 
        }
        try{
            // перевирка валідатності токена та дістаємо айди юзера
            res.locals.userId = verifyAccessToken(token)
            next()
        } catch{
            // якщо токен не валідатний або простроченний недаємо доступ
            res.status(401).json({message: "Unauthorized"})
        }
    }
}
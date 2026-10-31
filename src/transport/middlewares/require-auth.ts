// імпорт типа RequestHandler з express
import type { RequestHandler } from "express";
// створюємо функцію createRequireAuth, яка має функцію verifyAccessToken як параметр
export function createRequireAuth(
    verifyAccessToken: (token: string)=> number
): RequestHandler{
    // повертаємо функцію яка перевіряє token в cookie
    return (req, res, next)=>{
        const token = req.cookies?.accessToken
        // якщо токен відсутній або не є рядком повертаємо статус 401
        if (typeof token !== "string"){
            res.status(401).json({message: "Unauthorized"})
            return 
        }
        // перевіряємо за допомогою try, чи є token, якщо є то виконуємо перевірку за допомогою функції verifyAccessToken
        try{
            res.locals.userId = verifyAccessToken(token)
            next()
        } catch{
            // якщо token відсутній, повертаємо статус 401
            res.status(401).json({message: "Unauthorized"})
        }
    }
}
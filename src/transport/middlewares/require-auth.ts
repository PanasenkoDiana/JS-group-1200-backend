// імпортуємо тип RequestHandler з бібліотеки express
import type { RequestHandler } from "express";
// створюємо функцію createRequireAuth, яка приймає функцію verifyAccessToken як параметр
export function createRequireAuth(
    verifyAccessToken: (token: string)=> number
): RequestHandler{
    // повертаємо функцію, яка перевіряє наявність токена в cookie
    return (req, res, next)=>{
        const token = req.cookies?.accessToken
        // якщо токен відсутній або не є рядком, повертаємо статус 401 Unauthorized
        if (typeof token !== "string"){
            res.status(401).json({message: "Unauthorized"})
            return 
        }
        // якщо токен присутній, виконуємо перевірку за допомогою функції verifyAccessToken
        try{
            res.locals.userId = verifyAccessToken(token)
            next()
        } catch{
            // якщо токена немає, повертаємо статус 401 Unauthorized
            res.status(401).json({message: "Unauthorized"})
        }
    }
}
import type { RequestHandler } from "express";

// Проверка авторизации по JWT 
export function createRequireAuth(
    verifyAccessToken: (token: string)=> number
): RequestHandler{
    return (req, res, next)=>{
        const token = req.cookies?.accessToken
        if (typeof token !== "string"){
            res.status(401).json({message: "Unauthorized"})
            return 
        }
        try{
            res.locals.userId = verifyAccessToken(token)
            next()
        } catch{
            res.status(401).json({message: "Unauthorized"})
        }
    }
}
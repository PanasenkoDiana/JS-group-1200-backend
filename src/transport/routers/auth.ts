import { Router } from "express";
import type { AuthHandler } from "../handlers/auth";

export function createAuthRouter (handler: AuthHandler){
    const router = Router()
    router.post("/register", handler.register)
    router.post("/login", handler.login)
    return router
}
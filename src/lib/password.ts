import "dotenv/config"
import argon2 from "argon2"
const pepperHex = process.env.PASSWORD_PEPPER

if (!pepperHex) throw new Error("PASSWORD_PEPPER is not defined")
const pepper = Buffer.from(pepperHex, "hex")

export function hashPassword(password: string): Promise<string>{
    return argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 19456,
        timeCost: 2,
        parallelism: 1,
        secret: pepper
    })
}

export function verifyPassword(hash: string, password: string): Promise<boolean>{
    return argon2.verify(hash, password, {secret: pepper})
}
import "dotenv/config"
import jwt from "jsonwebtoken";

const secret = process.env.JWT_ACCESS_SECRET;
if (!secret) throw new Error("JWT_ACCESS_SECRET is not defined");

export function signAccessToken(userId: number): string {
  return jwt.sign({}, secret!, {
    algorithm: "HS256",          
    subject: String(userId),     
    expiresIn: "15m",            
  });
}
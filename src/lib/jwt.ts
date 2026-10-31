import "dotenv/config"
import jwt from "jsonwebtoken";

//отримує ключ для підпису токенів
const secret = process.env.JWT_ACCESS_SECRET;

// якщо секрет не був заданий зупиняємо віконнаня помилки
if (!secret) throw new Error("JWT_ACCESS_SECRET is not defined");

export function signAccessToken(userId: number): string {

  // генеруємо токен
  return jwt.sign({}, secret!, {
    algorithm: "HS256",      

    // зберігаємо у юзера айді  
    subject: String(userId),     
    
    // час життя токену
    expiresIn: "15m",            
  });
}
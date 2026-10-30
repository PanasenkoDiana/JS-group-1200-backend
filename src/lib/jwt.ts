import "dotenv/config"
import jwt from "jsonwebtoken";
const accessSecret = process.env.JWT_ACCESS_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET;
// перевіряємо наявність accessSecret та refreshSecret, якщо вони не знайдені, виводимо помилку
if (!accessSecret) throw new Error("JWT_ACCESS_SECRET is not defined");
if (!refreshSecret) throw new Error("JWT_REFRESH_SECRET is not defined");
// функція signAccessToken приймає userId та повертає JWT токен 
export function signAccessToken(userId: number): string {
  return jwt.sign({}, accessSecret!, {
    algorithm: "HS256",          
    subject: String(userId),     
    expiresIn: "15m",            
  });
}
// функція signRefreshToken приймає userId та повертає JWT токен з типом "refresh"
export function signRefreshToken(userId: number): string {
  return jwt.sign({type: "refresh"}, refreshSecret!, {
    algorithm: "HS256",          
    subject: String(userId),     
    expiresIn: "7d",            
  });
}
// функція verifyAccessToken приймає токен та повертає userId, якщо токен дійсний, або виводить помилку, якщо токен недійсний
export function verifyAccessToken(token: string): number {
  try {
    const payload = jwt.verify(token, accessSecret!, {
      algorithms: ["HS256"] 
    })
    if (typeof payload === "string" || typeof payload.sub !== "string" ) {
      throw new Error()
    }
    const userId = Number(payload.sub)
    if (!Number.isSafeInteger(userId) || userId <= 0) {
      throw new Error()
    }
    return userId
  }
  catch {
    throw new Error("INVALID_ACCESS_TOKEN")
  }
}
// функція verifyRefreshToken приймає токен та повертає userId, якщо токен дійсний та має тип "refresh", якщо ні,виводить помилку
export function verifyRefreshToken(token: string): number {
  try {
    const payload = jwt.verify(token, refreshSecret!, {
      algorithms: ["HS256"] 
    })
    if (typeof payload === "string" || typeof payload.sub !== "string" || payload.type !== "refresh" ) {
      throw new Error()
    }
    const userId = Number(payload.sub)
    if (!Number.isSafeInteger(userId) || userId <= 0) {
      throw new Error()
    }
    return userId
  }
  catch {
    throw new Error("INVALID_REFRESH_TOKEN")
  }
}
import "dotenv/config";

// Это вспомогательная функция.
// Она получает название переменной и проверяет, существует ли она.
function required(name: string): string {
	const value = process.env[name];
	if (!value) {
		throw new Error(`${name} is not defined`);
	}
	return value;
}

// Эта функция проверяет, что значение является положительным целым числом.
function positiveInt(name: string, fallback: number): number {
	const raw = process.env[name];

	if (raw === undefined || raw === "") {
		return fallback;
	}

	const value = Number(raw);

	if (!Number.isSafeInteger(value) || value <= 0) {
		throw new Error(`${name} must be a positive integer`);
	}

	return value;
}

// Здесь мы собираем все настройки в один объект config.
export const config = {
	port: positiveInt("PORT", 8000),
	corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
	databaseUrl: required("DATABASE_URL"),

	// Buffer — встроенный механизм Node.js для работы с бинарными данными (данными в виде байтов).
	// Buffer.from() создаёт буфер на основе переданных данных.
	passwordPepper: Buffer.from(required("PASSWORD_PEPPER"), "hex"),
	jwt: {
		accessSecret: required("JWT_ACCESS_SECRET"),
		refreshSecret: required("JWT_REFRESH_SECRET"),
		accessTtlMs: positiveInt("TOKEN_ACCESS_TIME", 15 * 60 * 1000),
		refreshTtlMs: positiveInt("TOKEN_REFRESH_TIME", 7 * 24 * 60 * 60 * 1000),
	},
} as const;

// «Создай и экспортируй тип Config, который автоматически определяется на основе типа объекта config».
export type Config = typeof config;

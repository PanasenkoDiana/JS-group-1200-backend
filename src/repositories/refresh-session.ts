import type { RefreshSession } from "../domain/refresh-session/entity.js";
import type { RefreshSessionRepository } from "../domain/refresh-session/repository.js";
import { Temporal } from "@js-temporal/polyfill";

// Получаем тип Prisma database client
type DataBase = typeof import("../prisma/db.js").db;

// Преобразуем Date в Temporal.Instant для Prisma
function toInstant(date: Date) {
    // Создаём Temporal.Instant из количества миллисекунд
    // Приводим тип к never, чтобы передать значение в ORM без конфликта типов
    return Temporal.Instant.fromEpochMilliseconds(date.getTime()) as never;
}

// Преобразуем Temporal.Instant обратно в обычный Date
function toDate(instant: { epochMilliseconds: number }): Date {
    // Создаём Date из количества миллисекунд
    return new Date(instant.epochMilliseconds);
}

export function createRefreshSessionRepository(
    database: DataBase
): RefreshSessionRepository {
    return {
        async create(data) {
            await database.orm.public.RefreshSession.create({
                ...data,
                expiresAt: toInstant(data.expiresAt)
            });
        },

        async getByHash(hash) {
            const session = await database.orm.public.RefreshSession
                .where({ tokenHash: hash })
                .first();

            if (!session) {
                return null;
            }

            // Преобразуем даты ORM в обычные Date
            return {
                ...session,
                expiresAt: toDate(session.expiresAt),
                createdAt: toDate(session.createdAt)
            };
        },

        // Обновляем хеш токена и срок действия сессии
        async rotate(oldHash, newHash, expiresAt) {
            const updated = await database.orm.public.RefreshSession.where({ tokenHash: oldHash })
                .update({
                    tokenHash: newHash,
                    expiresAt: toInstant(expiresAt)
                });

            return updated !== null;
        },

        // Удаляем сессию по хешу токена
        async deleteByHash(hash) {
            await database.orm.public.RefreshSession.where({ tokenHash: hash }).delete();
        }
    };
}
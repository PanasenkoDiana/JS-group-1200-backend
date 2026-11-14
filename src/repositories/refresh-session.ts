import type { RefreshSession } from "../domain/refresh-session/entity";
import type { RefreshSessionRepository } from "../domain/refresh-session/repository";
import { Temporal } from "@js-temporal/polyfill";
type DataBase = typeof import("../prisma/db.js").db

function toInstant(date: Date){
    // створюємо потрібний тип дати для прізма за допопомогую Temporal.instant з кількости мілісекунд 
    return Temporal.Instant.fromEpochMilliseconds(date.getTime())as never

}
function toDate(instant: {epochMilliseconds:number}):Date{
    // повертаємо звичну дату з БД
    return new Date(instant.epochMilliseconds)
}


export function createRefreshSessionRepository(database: DataBase): RefreshSessionRepository {
    return{ 
        async create(data) {
            await database.orm.public.RefreshSessions.create({
                ...data,
                expiresAt: toInstant(data.expiresAt)
            });
        },
        async getByHash(hash){
            const session = await database.orm.public.RefreshSessions.where({tokenHash: hash}).first()
            if (!session){ return null }
            return {
                ...session, expiresAt: toDate(session.expiresAt), createdAt: toDate(session.createdAt)               
            }
        
        },

        async rotate(oldHash, newHash, expiresAt){
            const update = await database.orm.public.RefreshSessions.where({tokenHash:oldHash})
                .update({
                    tokenHash: newHash, expiresAt:toInstant(expiresAt)
                }) 
            return update !== null
        
        },
        async deletedByHash(hash){
            await database.orm.public.RefreshSessions.where({tokenHash: hash}).delete()
        }
    }

}
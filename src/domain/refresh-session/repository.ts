
import type { RefreshSession } from "./entity";
export type NewRefreshSession = Pick<RefreshSession, 'userId'|'tokenHash'|'expiresAt' >

export interface RefreshSessionRepository{
    create(data: NewRefreshSession): Promise<void>
    getByHash(hash:string): Promise<RefreshSession|null>
    rotate(oldHash:string, newHash:string, expiresAt: Date): Promise<boolean>
    deletedByHash(hash: string): Promise<void>
}

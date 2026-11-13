import type { RefreshSession } from "./entity.js"; 
 
export type NewRefreshSession = Pick< 
  RefreshSession, "userId" | "tokenHash" | "expiresAt" 
>; 
 
export interface RefreshSessionRepository { 
  create(data: NewRefreshSession): Promise<void>; 
  getByHash(hash: string): Promise<RefreshSession | null>; 
  rotate(oldHash: string, newHash: string, 
         expiresAt: Date): Promise<boolean>; 
  deleteByHash(hash: string): Promise<void>; 
}
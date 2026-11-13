export interface RefreshSession { 
  id: number; 
  userId: number; 
  tokenHash: string; 
  expiresAt: Date; 
  createdAt: Date; 
}
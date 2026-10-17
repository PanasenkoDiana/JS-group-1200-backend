import type { User } from "./entity";

export type NewUser = Omit<User, 'id'>

export interface UserRepository{
    getByEmail(email:string): Promise<User | null>
    createUser(data:NewUser): Promise<User>
}
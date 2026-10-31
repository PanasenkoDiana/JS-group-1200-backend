export interface User{
    id:number
    email:string
    passwordHash:string
}
export type PublicUser = Pick<User, 'id'|'email'>
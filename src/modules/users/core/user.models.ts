import { password } from "bun";
import z from "zod";
export enum Role {
    admin = "admin",
    client = "client",
  }

export type User = {
    id: string;
    name: string;
    email: string;
    password:string;
    role: string;
    createdAt: Date;
}

export type createUserInput= Omit<User, 'id'| 'createdAt'>

export const createUserSchema = z.object({
    name:z.string().min(2),
    email: z.string().regex( /^[^\s@]+@[^\s@]+\.[^\s@]+$/,"Email invalide"),
    password: z.string().min(6),
    role: z.enum(Object.values(Role) as [string, ...string[]]).default(Role.client),
})

export interface UserRepository {
    create: (user:User)=> Promise<User>;
    readOne: (email: string) => Promise<User| undefined>;

}
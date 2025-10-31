import { partial } from "zod/mini";
import type { createUserInput, User, UserRepository } from "./user.models";
import bcrypt from "bcrypt";


export class UserService {
    private repo: UserRepository;

    constructor(repository:UserRepository) {
        this.repo = repository;
    }


    async createUser(partialData: createUserInput): Promise<User> {
    
        partialData.password = await bcrypt.hash(partialData.password, 10)
        
        const user: User = {
             id: crypto.randomUUID(),
             createdAt: new Date(),
             ...partialData
        }

        const exists = await this.repo.readOne(user.email);
        if(exists) {
            throw new Error(`User with email ${user.email} already exists`)
        }

        return  await this.repo.create(user);

    } 

    async readOneUser(email:string):Promise<User| undefined> {
        const userFound = await this.repo.readOne(email);

        if(!userFound){
            return undefined
        } 
        return userFound;
    }

   
}
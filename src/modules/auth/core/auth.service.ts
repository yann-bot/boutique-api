
import {  type UserRepository} from "../../users/core/user.models";
import type { LoginInput, LoginOutput } from "./auth.models";
import bcrypt from 'bcrypt';
import { generateJwt } from "../../../lib/auth";
import { UserNotFoundError, InvalidPasswordError } from "../../../lib/errorHandler";



export class AuthService {

    private repo: UserRepository;

    constructor(repository: UserRepository) {
        this.repo = repository;
    }


    async login(input: LoginInput):Promise<LoginOutput> {
        const userFound = await this.repo.readOne(input.email);
        if(!userFound){
            throw new UserNotFoundError(input.email); 
                          
        }
        const match = await bcrypt.compare(input.password, userFound.password);
        if (!match) {
            throw new InvalidPasswordError();
        }
        
        const token = generateJwt(userFound.id, input.email, userFound.role);
        return {token}
        
    }


    


}
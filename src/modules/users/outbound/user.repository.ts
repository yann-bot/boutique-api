import type  { User, UserReposiory } from "../core/user.models";





export class InMemory implements UserReposiory {
    private db: User[] = [];


     create(user: User):Promise<User>{
          this.db.push(user);
          return Promise.resolve(user)
     }

     readOne(key: string): Promise<User | undefined> {
          return Promise.resolve(this.db.find(u => u.email === key))
     }

   
}

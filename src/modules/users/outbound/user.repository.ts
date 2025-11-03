import type  { User, UserRepository } from "../core/user.models";





export class InMemory implements UserRepository {
    private db: User[] = [];


     create(user: User):Promise<User>{
          this.db.push(user);
          return Promise.resolve(user)
     }

     readOne(key: string): Promise<User | undefined> {
          return Promise.resolve(this.db.find(u => u.email === key))
     }

     update(email: string, newUser: User): Promise<User> {
          const idx = this.db.findIndex(u => u.email === email);
          if (idx === -1) {
               return Promise.reject(new Error("User not found"));
          }
          this.db[idx] = newUser;
          return Promise.resolve(newUser);
     }

     delete(email: string): Promise<boolean> {
          const idx = this.db.findIndex(u => u.email === email);
          if (idx === -1) {
               return Promise.resolve(false);
          }
          this.db.splice(idx, 1);
          return Promise.resolve(true);
     }

   
}

import db from '@/db/index'
import type { FavoriteRepistory , Favorite} from '../core/favorite.model';
import { favorites } from '@/db/schemas';
import { eq } from 'drizzle-orm';
import { fa } from 'zod/locales';



export class FavoriteDrizzleRepository implements FavoriteRepistory {


    async create(favorite: Favorite):Promise<Favorite>{
        
        const [result]= await db.insert(favorites).values(favorite).returning();
        return result as Favorite;

    }

     async readOne(id:string):Promise<Favorite| undefined>{
            const result = await db.select().from(favorites).where(eq(favorites.id, id)).limit(1);
            return result[0];
     }

     async readAll():Promise<Favorite[]>{
        const result = await db.select().from(favorites);
        return result;
     }

     async delete(id: string):Promise<boolean> {
        const deleted = await db.delete(favorites).where(eq(favorites.id, id)).returning({ id: favorites.id });
        return deleted.length > 0;
     }
}
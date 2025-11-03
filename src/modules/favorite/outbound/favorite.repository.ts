

import type { FavoriteRepistory, Favorite  } from "../core/favorite.model";


export class InMemory implements FavoriteRepistory {
    private db: Favorite[] = [];

    create(favorite: Favorite): Promise<Favorite> {
        this.db.push(favorite);
        return Promise.resolve(favorite);
    }


    readOne(id: string): Promise<Favorite | undefined> {
        const favorite = this.db.find(favorite => favorite.id === id);
        if (!favorite) {
            return Promise.resolve(undefined);
        }
        return Promise.resolve(favorite);
    }

   readAll(): Promise<Favorite[]> {
        return Promise.resolve(this.db);
    }

    delete(id: string): Promise<boolean> {
        const index = this.db.findIndex(favorite => favorite.id === id);
        if (index === -1) {
            return Promise.resolve(false);
        }
        this.db.splice(index, 1);
        return Promise.resolve(true);
    }
}
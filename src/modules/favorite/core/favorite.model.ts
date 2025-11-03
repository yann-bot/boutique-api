
import z  from "zod";

export type Favorite = {
    id: string
    user_id: string,
    shop_id: string,
    createdDate: Date,
}


export type createdFavoriteInput = Omit<Favorite, 'id' | 'createdDate'>

export interface FavoriteRepistory {
    create: (favorite: Favorite) => Promise<Favorite>
    readOne: (id: string) => Promise<Favorite | undefined>
    readAll: () => Promise<Favorite[]>
    delete: (id: string) => Promise<boolean>
}

export const createFavoriteSchema = z.object({
    user_id: z.string(),
    shop_id: z.string(),
  
})
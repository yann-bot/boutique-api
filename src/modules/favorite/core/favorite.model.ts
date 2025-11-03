import type { User } from "@/modules/users/core/user.models";
import z  from "zod";

export type Favorite = {
    id: string
    user_id: string,
    shop_id: string,
    add_date: string,
}


export type createdFavoriteInput = Omit<Favorite, 'id'>

export interface FavoriteRepistory {
    create: (favorite: Favorite) => Promise<Favorite>
    readOne: (id: string) => Promise<Favorite | undefined>
    readAll: () => Promise<Favorite[]>
    delete: (id: string) => Promise<boolean>
}

export const createFavoriteSchema = z.object({
    user_id: z.string(),
    shop_id: z.string(),
    add_date: z.string(),
})
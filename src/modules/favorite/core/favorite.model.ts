

export type Favorite = {
    id: string,
    user_id: string,
    shop_id: string,
    add_date: string,
}


export type createdFavorite = Omit<Favorite, 'id'>

export interface FavoriteRepistory {
    create: (favorite: Favorite) => Promise<Favorite>
    delete: (id: string) => Promise<void>
}
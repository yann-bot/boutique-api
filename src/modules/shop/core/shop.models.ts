

export type Shop = {
  id: string;
  name: string;
  description: string;
  address: string;
  category: string;
  phone: string;
  contactEmail?: string;
  website?: string;
  images?: string[];
  createdBy: string;
  publishedAt: Date;
  isActive: boolean;
}


export type createShopInput = Omit<Shop, 'id' | 'publishedAt'>

export interface ShopRepository {
    create: (input: Shop)=> Promise<Shop>//admin
    readAll: () => Promise<Shop[]>//public
    readOne: (id: string) => Promise<Shop| undefined>//public
    update: (id: string, newShop:Shop) => Promise<Shop>//admin
    delete: (id: string) => Promise<Boolean> //admin
}
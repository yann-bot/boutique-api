import z from "zod";


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
    delete: (id: string) => Promise<boolean> //admin
}

export const createShopSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  address: z.string().min(1),
  category: z.string().min(1),
  phone: z.string().min(6),
  contactEmail: z.string().email().optional(),
  website: z.string().url().optional(),
  images: z.array(z.string().url()).optional(),
  createdBy: z.string().min(1),
  isActive: z.boolean(),
});

export const updateShopSchema = createShopSchema.partial();
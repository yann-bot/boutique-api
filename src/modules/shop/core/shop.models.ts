import z from "zod";


export type Shop = {
  id: string;
  name: string;
  description: string;
  address: string;
  category: string;
  phone?: string | null;
  contactEmail?: string | null ;
  website?: string | null;
  images?: string[] | null ;
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
  phone: z.string().min(6).optional().nullable(),
  contactEmail: z.string().email().optional().nullable(),
  website: z.string().url().optional().nullable(),
  images: z.array(z.string().url()).optional().nullable(),
  createdBy: z.string().min(1),
  isActive: z.boolean(),
});

export const updateShopSchema = createShopSchema.partial();
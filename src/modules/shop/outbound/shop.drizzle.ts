import db from "@/db";
import { shops } from "@/db/schemas";
import type { Shop, ShopRepository } from "../core/shop.models";
import { eq } from "drizzle-orm";

type ShopInsert = typeof shops.$inferInsert;
type ShopRow = typeof shops.$inferSelect;

const toRow = (shop: Shop): ShopInsert => ({
  id: shop.id,
  name: shop.name,
  description: shop.description,
  address: shop.address,
  category: shop.category,
  phone: shop.phone ?? null,
  contactEmail: shop.contactEmail ?? null,
  webSite: shop.website ?? null,
  images: JSON.stringify(shop.images ?? []),
  createdBy: shop.createdBy,
  publishedAt: shop.publishedAt,
  isActive: shop.isActive,
});

const fromRow = (row: ShopRow): Shop => ({
  id: row.id,
  name: row.name,
  description: row.description,
  address: row.address,
  category: row.category,
  phone: row.phone ?? undefined,
  contactEmail: row.contactEmail ?? undefined,
  website: row.webSite ?? undefined,
  images:
    typeof row.images === "string"
      ? JSON.parse(row.images)
      : Array.isArray(row.images)
        ? row.images
        : undefined,
  createdBy: row.createdBy,
  publishedAt:
    row.publishedAt instanceof Date
      ? row.publishedAt
      : new Date(row.publishedAt),
  isActive: row.isActive,
});

export class ShopDrizzleRepository implements ShopRepository {

  async create(shop: Shop): Promise<Shop> {
    const [inserted] = await db.insert(shops).values(toRow(shop)).returning();
    return fromRow(inserted!);
  }

  async readAll(): Promise<Shop[]> {
    const rows = await db.select().from(shops);
    return rows.map(fromRow);
  }

  async readOne(id: string): Promise<Shop | undefined> {
    const rows = await db.select().from(shops).where(eq(shops.id, id));
    return rows.length ? fromRow(rows[0]!) : undefined;
  }


  async update(id: string, newShop: Shop): Promise<Shop> {
    const [updated] = await db
      .update(shops)
      .set({
        ...toRow(newShop),
        id,
      })
      .where(eq(shops.id, id))
      .returning();
    if (!updated) {
      throw new Error("Shop not found");
    }
    return fromRow(updated);
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await db
      .delete(shops)
      .where(eq(shops.id, id))
      .returning({ id: shops.id });
    return deleted.length > 0;
  }
}
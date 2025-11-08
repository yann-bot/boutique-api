import { sqliteTable as Table, text, integer, uniqueIndex } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";



export const users = Table( 'users', {
      id: text('id').primaryKey(),  // id: string;
      name: text('name').notNull(),  //name: string;
      email: text('email').notNull().unique(), //email: string;
      password: text('password').notNull(),  //password:string;
      role: text('role').notNull(), //role: string;
      createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s','now')*1000)`) //createdAt: Date;
})


export const shops = Table("shops", {
    id: text("id").primaryKey(), // id: string;
    name: text("name").notNull(), // name: string;
    description: text("description").notNull(), // description: string;
    address: text("address").notNull(), // address: string;
    category: text("category").notNull(), // category: string;
    phone: text("phone"), // phone: string;
    contactEmail: text("contact_email"), // contactEmail?: string;
    webSite: text("web_site"), // webSite?: string;
    images: text("images").notNull().default("[]"), // images stored as JSON string
    createdBy: text("created_by").notNull().references(() => users.id), // createdBy: string;
    publishedAt: integer("published_at", { mode: 'timestamp' }).notNull().default(sql`(strftime('%s','now')*1000)`), // publishedAt: Date;
    isActive: integer("is_active", { mode: 'boolean' }).notNull().default(true), // isActive: boolean;
  });


  export const favorites = Table('favorites', {
    id: text('id').primaryKey(), // id: string
    user_id: text('user_id').notNull().references(() => users.id), // user_id: string,
    shop_id: text('shop_id').notNull().references(() => shops.id), // shop_id: string,
    createdDate: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s','now')*1000)`) // createdDate: Date,
  },
  (table) => ({
    uniqueUserShop: uniqueIndex("unique_user_shop").on(table.user_id, table.shop_id)
  })
);



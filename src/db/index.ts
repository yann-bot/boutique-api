import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

// Local SQLite file via libsql client
const client = createClient({ url: "file:./sqlite.db" });
const db = drizzle(client);

export default db;
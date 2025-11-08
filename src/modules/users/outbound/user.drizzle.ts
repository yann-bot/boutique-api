

import db from '@/db';
import { users } from '@/db/schemas';
import type { User, UserRepository } from '../core/user.models';
import { eq } from 'drizzle-orm';


export class UserDrizzleRepository implements UserRepository {
     
    async create(user: User): Promise<User> {
        const result = await db.insert(users).values(user).returning();
        return result[0]!;
    }

    async readOne(key: string): Promise<User | undefined> {
        const result = await db.select().from(users).where(eq(users.email, key)).limit(1);
        return result[0];
    }

    async update(email: string, newUser: User): Promise<User> {
        const updated = await db.update(users).set(newUser).where(eq(users.email, email)).returning();
        if (!updated[0]) {
            throw new Error('User not found');
        }
        return updated[0]!;
    }

    async delete(email: string): Promise<boolean> {
        const deleted = await db.delete(users).where(eq(users.email, email)).returning({ id: users.id });
        return deleted.length > 0;
    }

}
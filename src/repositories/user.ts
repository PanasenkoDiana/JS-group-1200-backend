import type { UserRepository } from "../domain/user/repository.js";

type Database = typeof import("../prisma/db.js").db;

export function createUserRepository(
    database: Database,
): UserRepository {
    return {
    async getByEmail(email) {
        return database.orm.public.User.where({ email }).first();
    },

    async createUser(data) {
        try {
        return await database.orm.public.User.create(data);
        }
        catch(error){
        if (
            // Перевіряємо що помилка це повноцінний об'єкт javascript
            error instanceof Error &&
            // Перевіряємо що у помилки є властивість sqlState
            "sqlState" in error &&
            // Код 23505 означає unique violation (порушує унікальність поля)
            error.sqlState === "23505"
        ){
            throw new Error("PRODUCT_ALREADY_EXIST")
        }
        throw error;
        }
    },
};
}

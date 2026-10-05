import type { Product } from "../domain/product/entity.ts"
import type { ProductRepository } from "../domain/product/repository.ts"

// отримуємо тип prisma database client
type DataBase = typeof import("../prisma/db.js").db

export function createProductRepository(database: DataBase): ProductRepository {
    return {
        async getAll(take){
            // database - підключення до БД 
            // ORM - інструмент для роботи з БД
            //  public - схема БД
            // Product - таблиця продуктів
            // orderBy - сортируємо продукти
            // product.id.asc - сортируємо продукти зо зростанням id (desc - за зменшенням)
            const query = database.orm.public.Product.orderBy((product) => 
                product.id.asc()
            ) 
            if (!take){
                return query.all()
            }
            // limit - обмежує число продуктів
            // all - отримує всі знайдені продукти
            return query.limit(take).all()
        },
        async getById(id){
            // where - знайти продукт з указаним параметром
            // .first - взяти перший знайденний продукт
            return database.orm.public.Product.where({id}).first()
        },
        async createProduct(data){
            // create - створення нового продукту у базі данних
            return database.orm.public.Product.create(data)
        }
    }
}

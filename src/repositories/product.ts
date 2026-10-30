import type { Product } from "../domain/product/entity.ts"
import type { ProductRepository } from "../domain/product/repository.ts"
import { isStructuredError } from "@prisma/orm-postgres/utils"

// отримуємо тип prisma database client
type DataBase = typeof import("../prisma/db.js").db

export function createProductRepository(database: DataBase): ProductRepository {
    return {
        async getAll(take, categoryId){
            // database - підключення до БД 
            // ORM - інструмент для роботи з БД
            //  public - схема БД
            // Product - таблиця продуктів
            // orderBy - сортируємо продукти
            // product.id.asc - сортируємо продукти зо зростанням id (desc - за зменшенням)
            const query = categoryId !== undefined
                ?database.orm.public.Product
                    .where({categoryId})
                    // використовується для загрузки зв'язаних данних (relations)
                    .include("category")
                    .orderBy((product)=>product.id.asc())
                :database.orm.public.Product
                    .include("category")
                    .orderBy((product)=>product.id.asc())
            
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
            return database.orm.public.Product
            .where({id}).include('category').first()
        },
        async createProduct(data){
            const {categoryId, ...fields} = data
            // create - створення нового продукту у базі данних
            try{
                return await database.orm.public.Product.create({
                    ...fields, 
                    // connect - використовується для з'єднання записів між собою у таблицях
                    category:(category)=>category.connect({id: categoryId})
                })
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
                if (
                    // Функція перевіряє чи є об'єкт помилки 
                    // структурованим об'єктом нашої orm
                    isStructuredError(error)&&
                    error.code === "ORM.RELATION_ROW_MISSING"
                ){
                    throw new Error("CATEGORY_NOT_FOUND")
                }
                throw error
            }
        }
    }
}

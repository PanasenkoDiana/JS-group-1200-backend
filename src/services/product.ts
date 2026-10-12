import type { ProductRepository } from "../domain/product/repository.js"
import type { CreateProductInput, ProductService } from "./product/product.types.js"

export function createProductService(repository: ProductRepository): ProductService {
    return {
        getProducts(take?: number, categoryId?: number){
            return repository.getAll(take, categoryId)  
        },
        getProductById(id: number) {
            return repository.getById(id)
        },
//створюємо асинхронну функцію створення продукту
//у параметрах вказуемо те, що приходить від кліенту
        async createProduct(input: CreateProductInput) {
            const name = input.name.trim()
            const products = await repository.getAll()
//метод Some перевіряє співпадає хоча б один елемент массиву з умовою 
            const duplicate = products.some(
                ( product ) => product.name.toLowerCase() === name.toLowerCase()
            )
            if (duplicate) {
                return null
            }
            return repository.createProduct({
                name,
                price: input.price,
                image: input.image ?? "",
                categoryId: input.categoryId
            })
        }
    }
}
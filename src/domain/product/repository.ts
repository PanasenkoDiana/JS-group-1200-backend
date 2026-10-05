//створення контракту для репозиторію продукту

import type { Product } from "./entity.js";

// omit - метод, который позволяет создать новый тип исключив 
// определённые свойства из уже существующего
 
export type NewProduct = Omit<Product, "id">

//опис того як має виглядати саме репозиторій 
export interface ProductRepository{
    getAll(take?:number): Promise<Product[]>
    getById(id:number): Promise<Product | null>
//опис функції яка має обов'язкого бути у репозиторію
    createProduct(data: NewProduct): Promise<Product>
}

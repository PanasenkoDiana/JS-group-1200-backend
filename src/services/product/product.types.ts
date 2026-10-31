import type { Product, ProductWithCategory } from "../../domain/product/entity.js"

export interface CreateProductInput {
    name: string,
    price: number,
    image?: string,
    categoryId: number
}

export interface ProductService {
    getProducts(take?: number, categoryId?: number): Promise<ProductWithCategory[]>
    getProductById(id: number): Promise<ProductWithCategory | null>
    createProduct(input: CreateProductInput): Promise<Product | null>
}
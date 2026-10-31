export interface CreateProductRequest {
    name: string
    price: number
    image?: string
    categoryId: number
}
export interface ProductResponse {
    id: number
    name: string
    price: number
    image: string
    categoryId: number
    category?: {
        id: number, 
        name: string
    }
}
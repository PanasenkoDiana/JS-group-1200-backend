import type { ProductHandlers } from "../handlers/product.js";
//что бы создавать обычные пути
import { Router } from "express";
export function createProductRouter(handlers: ProductHandlers){
    const router = Router()
    router.get('/', handlers.getProducts)
    router.get('/:id', handlers.getProductById)
    router.post('/', handlers.createProduct)

    return router
}
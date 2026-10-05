import express from 'express'
import { createProductRouter } from './transport/routers/product.js'
import { createProductHandler } from './transport/handlers/product.js';
import { createProductRepository } from './repositories/product.js';
import { createProductService } from './services/product.js';
import { db } from './prisma/db.js';
//const express = require('express');

const app = express();
const productRepository = createProductRepository(db)
const productService = createProductService(productRepository)
const productHandlers = createProductHandler(productService)
const productRouter = createProductRouter(productHandlers)
// app.use(express.json()) - встроенный middleware, который позволяет спарсить json обьект в js обьект
app.use(express.json())
app.use('/products', productRouter)
// products    ->  router.get('/', getProducts)
// products/1  ->  router.get('/:id', getProductById)

const PORT = 8000
const HOST = 'localhost'; 



app.listen(PORT, HOST, ()=>{
    console.log(`Сервер запущен на http://${HOST}:${PORT}`)
})


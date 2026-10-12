import type { Request, Response } from "express";
import type { ProductService } from "../../services/product/product.types.js";
import type { ErrorResponse } from "../dto/product/errors.js";
import type { CreateProductRequest } from "../dto/product/requests.js";
import type { ProductResponse } from "../dto/product/responses.js";

export interface ProductHandlers {
    getProducts(
        req: Request,
        res: Response<ProductResponse[] | ErrorResponse>,
    ): Promise<void>;

    getProductById(
        req: Request,
        res: Response<ProductResponse | ErrorResponse>,
    ): Promise<void>;

    createProduct(
        req: Request<{}, {}, CreateProductRequest>,
        res: Response<ProductResponse | ErrorResponse>,
    ): Promise<void>;
}

export function createProductHandler(
    productService: ProductService,
): ProductHandlers {
    return {
        async getProducts(req, res) {
            try {
                const { take } = req.query;

                if (!take) {
                const products = await productService.getProducts();
                res.status(200).json(products);
                return;
                }

                const takeNumber = Number(take);

                if (!Number.isInteger(takeNumber) || takeNumber <= 0) {
                res.status(400).json({ message: "take must be a positive integer" });
                return;
                }

                const products = await productService.getProducts(takeNumber);
                res.status(200).json(products);
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: "Internal server error" });
            }
            },

        async getProductById(req, res) {
            try {
                const productId = Number(req.params.id);

                if (!Number.isInteger(productId) || productId <= 0) {
                res.status(400).json({ message: "id must be a positive integer" });
                return;
                }

                const product = await productService.getProductById(productId);

                if (!product) {
                res.status(404).json({ message: "Product not found" });
                return;
                }

                res.status(200).json(product);
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: "Internal server error" });
            }
            },

        async createProduct(req, res) {
            try {
                const body = req.body;

                if (body === null || typeof body !== "object" || Array.isArray(body)) {
                res.status(422).json({ message: "Invalid product data" });
                return;
                }

                const { name, price, image, categoryId } = body;

                if (
                typeof name !== "string" || name.trim().length === 0 ||
                typeof price !== "number" || !Number.isFinite(price) || price <= 0 ||
                typeof categoryId !== "number" || !Number.isInteger(categoryId) || categoryId <= 0 ||
                (image !== undefined && typeof image !== "string")
                ) {
                res.status(422).json({ message: "Invalid product data" });
                return;
                }

                const product = await productService.createProduct({
                name, price, image, categoryId,
                });

                if (!product) {
                res.status(409).json({ message: "Product already exists" });
                return;
                }

                res.status(201).json(product);
            } catch (error) {
                if (
                    error instanceof Error && 
                    error.message === "CATEGORY_NOT_FOUND"
                ){
                    res.status(404).json({ message: "Category not found"});
                    return;
                }
                if (
                    error instanceof Error && 
                    error.message === "PRODUCT_ALREADY_EXIST"
                ){
                    res.status(409).json({message: "Product already exists"});
                    return;
                }
                if (
                    error instanceof Error && 
                    error.message === "INVALID_PRODUCT_DATA"
                ){
                    res.status(422).json({message: "Invalid product data" });
                    return;
                }
                console.error(error)
                res.status(500).json({message: "Internal server error"});
            }
        },
    };
}
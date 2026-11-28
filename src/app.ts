import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import {
	hashRefreshToken,
	signAccessToken,
	signRefreshToken,
	verifyAccessToken,
	verifyRefreshToken,
} from "./lib/token.js";
import { hashPassword, verifyPassword } from "./lib/password.js";
import { db } from "./prisma/db.js";
import { createProductRepository } from "./repositories/product.js";
import { createRefreshSessionRepository } from "./repositories/refresh-session.js";
import { createUserRepository } from "./repositories/user.js";
import { createAuthService } from "./services/auth/auth.js";
import { createProductService } from "./services/product.js";
import { createAuthHandlers } from "./transport/handlers/auth.js";
import { createProductHandler } from "./transport/handlers/product.js";
import { createRequireAuth } from "./transport/middlewares/require-auth.js";
import { createAuthRouter } from "./transport/routers/auth.js";
import { createProductRouter } from "./transport/routers/product.js";

//const express = require('express');

const app = express();
const productRepository = createProductRepository(db);
const productService = createProductService(productRepository);
const productHandlers = createProductHandler(productService);
const productRouter = createProductRouter(productHandlers);

const userRepository = createUserRepository(db);
const refreshSession = createRefreshSessionRepository(db);
const authService = createAuthService(
	userRepository,
	{ hash: hashPassword, verify: verifyPassword },
	{ signAccessToken, signRefreshToken },
	{ verifyRefreshToken },
	refreshSession,
	{ hash: hashRefreshToken },
);
const authHandlers = createAuthHandlers(authService);
const requireAuth = createRequireAuth(verifyAccessToken);
const authRouter = createAuthRouter(authHandlers, requireAuth);

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(express.json());
app.use(cookieParser());
app.use("/products", productRouter);
app.use("/auth", authRouter);

// products    ->  router.get('/', getProducts)
// products/1  ->  router.get('/:id', getProductById)

const PORT = 8000;
const HOST = "localhost";

app.listen(PORT, HOST, () => {
	console.log(`Сервер запущен на http://${HOST}:${PORT}`);
});

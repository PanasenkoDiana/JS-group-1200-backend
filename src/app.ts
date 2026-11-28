// Тепер файл app.ts відповідає виключно за створення застосунку та маршрутів без запуску

import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import type { Config } from "./config.js";
import { createContainer } from "./container.js";
import { ROUTES } from "./shared/constants/routes.js";

export function createApp(config: Config) {
	const { routers } = createContainer(config);
	const app = express();

	app.use(cors({ origin: config.crossOrigin, credentials: true }));
	app.use(express.json());
	app.use(cookieParser());

	app.use(ROUTES.PRODUCTS, routers.product);
	app.use(ROUTES.AUTH, routers.auth);
	return app;
}

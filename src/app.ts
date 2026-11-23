import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import type { Config } from "./config.js";
import { createContainer } from "./container.js";
import { ROUTES } from "./shared/constants/routes.js";

export function createApp(config: Config) {
  const { routers } = createContainer(config);
  const app = express();

  app.use(cors({ origin: config.corsOrigin, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());

  app.use(ROUTES.PRODUCTS, routers.product);
  app.use(ROUTES.AUTH, routers.auth);
  return app;
}
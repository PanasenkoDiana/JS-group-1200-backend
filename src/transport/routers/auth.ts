import { Router, type RequestHandler } from "express";
import type { AuthHandlers } from "../handlers/auth.js";

export function createAuthRouter(
  handlers: AuthHandlers,
  requireAuth: RequestHandler,
) {
  const router = Router();
  router.post("/register", handlers.register);
  router.post("/login", handlers.login);
  router.post("/refresh", handlers.refresh);
  router.get("/me", requireAuth, handlers.me);
  return router;
}
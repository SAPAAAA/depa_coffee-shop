import express from "express";
import authController from "./auth.controller";
import { authMiddleware } from "@/modules/shared/middlewares/auth.mdw";

const route = express.Router();

route.post("/login", authController.login);
route.get("/me", authMiddleware, authController.getMe);
route.post("/refresh", authController.refreshToken);
route.post("/logout", authController.logout);

export default route;
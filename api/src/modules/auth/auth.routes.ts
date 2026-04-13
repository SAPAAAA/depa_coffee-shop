import express from "express";
import authController from "./auth.controller";

const route = express.Router();

route.post("/login", authController.login);
route.post("/refresh", authController.refreshToken);
route.post("/logout", authController.logout);

export default route;
import express from "express";
import customerController from "./customer.controller";
import { authMiddleware, checkRole } from "@/modules/shared/middlewares/auth.mdw";

const route = express.Router();

route.use(authMiddleware);
route.get("/profile", checkRole(['customer']), customerController.getProfile);
route.put("/profile", checkRole(['customer']), customerController.updateProfile);

export default route;
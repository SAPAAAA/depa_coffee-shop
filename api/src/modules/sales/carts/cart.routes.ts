import { authMiddleware, checkRole } from '@/modules/shared/middlewares/auth.mdw';
import express from "express";
import cartController from "./cart.controller";

const route = express.Router();

route.post("/", authMiddleware, checkRole(['customer', 'admin']), cartController.createCart);
route.get("/customer", authMiddleware, checkRole(['customer', 'admin']), cartController.getCustomerCompleteCart);
route.post("/:cartId/items", authMiddleware, checkRole(['customer', 'admin']), cartController.createCartItem);
route.put("/:cartId/items/:itemId", authMiddleware, checkRole(['customer', 'admin']), cartController.updateCartItem);
route.put("/:cartId", authMiddleware, checkRole(['customer', 'admin']), cartController.updateCart);
route.delete("/:cartId", authMiddleware, checkRole(['customer', 'admin']), cartController.deleteCart);

export default route;
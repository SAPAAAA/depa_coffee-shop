import e from "express";

const route = e.Router();

import orderController from "./order.controller";
import { authMiddleware, checkRole } from "@/modules/shared/middlewares/auth.mdw";

route.use(authMiddleware);
route.get("/", checkRole(['customer', 'admin', 'barista']), orderController.getOrdersCompleteInfo);
route.post("/", checkRole(['customer']), orderController.createOrder);
route.patch("/:id/status", checkRole(['customer', 'admin', 'barista']), orderController.updateOrderStatus);

export default route;
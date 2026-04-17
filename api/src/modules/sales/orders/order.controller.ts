import type { Request, Response } from "express";
import type { OrderService } from "./order.service";
import {
  OrderStatusSchema,
  type DeliveryMethod,
  type OrderStatus,
  type PaymentMethod,
} from "./order.model";
import {
  BadRequestError,
  UnauthorizedError,
} from "@/modules/shared/utils/errors";
import orderService from "./order.service";

class OrderController {
  private readonly orderService: OrderService;

  constructor(orderService: OrderService) {
    this.orderService = orderService;
  }

  getOrdersCompleteInfo = async (req: Request, res: Response) => {
    if (!req.user) {
      throw new UnauthorizedError("User is not authenticated", "NO_USER");
    }

    const { status, customerId } = req.query;

    const queryParams: {
      status?: OrderStatus;
      customerId?: string;
    } = {};

    if (status) {
      const safeStatus = OrderStatusSchema.safeParse(status);
      if (!safeStatus.success) {
        throw new BadRequestError("Failed to get orders", "VALIDATION_ERROR");
      }
      queryParams.status = safeStatus.data;
    }

    if (req.user.role === "customer") {
      queryParams.customerId = req.user.id;
    } else if (customerId) {
      if (typeof customerId !== "string") {
        throw new BadRequestError("Failed to get orders", "VALIDATION_ERROR");
      }
      queryParams.customerId = customerId;
    }

    const orders = await this.orderService.getOrdersCompleteInfo(queryParams);
    return res.status(200).json({ success: true, data: { orders } });
  };

  getOrderCompleteInfo = async (req: Request, res: Response) => {
    if (!req.user) {
      throw new UnauthorizedError("User is not authenticated", "NO_USER");
    }

    const { id } = req.params;
    if (!id || Array.isArray(id)) {
      throw new BadRequestError("Failed to get order", "INVALID_ID");
    }

    const order = await this.orderService.getOrderCompleteInfo(id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Ensure customers can only access their own orders
    if (req.user.role === "customer" && order.customerId !== req.user.id) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    return res.status(200).json({ success: true, data: { order } });
  };

  updateOrderStatus = async (req: Request, res: Response) => {
    if (!req.user) {
      throw new UnauthorizedError("User is not authenticated", "NO_USER");
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!id || Array.isArray(id)) {
      throw new BadRequestError("Failed to update order status", "INVALID_ID");
    }

    const updatedOrder = await this.orderService.updateOrderStatus(id, status);
    return res
      .status(200)
      .json({ success: true, data: { order: updatedOrder } });
  };

  createOrder = async (req: Request, res: Response) => {
    if (!req.user) {
      throw new UnauthorizedError("User is not authenticated", "NO_USER");
    }

    const { id: customerId } = req.user;

    const { delivery, paymentMethod } = req.body as {
      delivery: { method: DeliveryMethod; address?: string };
      paymentMethod: PaymentMethod;
    };

    const createdOrder = await this.orderService.createOrder(
      customerId,
      delivery,
      paymentMethod,
    );

    return res
      .status(201)
      .json({ success: true, data: { order: createdOrder } });
  };
}

export type { OrderController };
export default new OrderController(orderService);

import { httpClient } from "@/utils/httpClient";
import type {
  CompleteOrder,
  DeliveryMethod,
  PaymentMethod,
} from "@api-types/sales/orders/order.model";

class OrderService {
  createOrder = async (
    delivery: { method: DeliveryMethod; address?: string },
    paymentMethod: PaymentMethod,
  ) => {
    const response = await httpClient.post<{ order: CompleteOrder }>("/api/orders", {
      delivery,
      paymentMethod,
    });
    return response.order;
  };

  getOrderById = async (orderId: string) => {
    const response = await httpClient.get<{ order: CompleteOrder }>(`/api/orders/${orderId}`);
    return response.order;
  };
}

export const orderService = new OrderService();
export default orderService;
export const { createOrder, getOrderById } = orderService;

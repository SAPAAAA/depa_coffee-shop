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

  getOrderWithPopulatedInfo = async (orderId: string) => {
    const response = await httpClient.get<{ order: CompleteOrder }>(`/api/orders/${orderId}/populated`);
    return response.order;
  };

  getOrdersWithPopulatedInfo = async (queryParams: {
    status?: string;
    customerId?: string;
  }) => {
    const queryString = new URLSearchParams(queryParams).toString();
    const response = await httpClient.get<{ orders: CompleteOrder[] }>(`/api/orders/populated?${queryString}`);
    return response.orders;
  };
}

export const orderService = new OrderService();
export default orderService;
export const { createOrder, getOrderById } = orderService;

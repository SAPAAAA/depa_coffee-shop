import db from "@/core/db/knex";
import { type DrinkVariantRepository } from "@/modules/catalog/variants/variant.repository";
import { BadRequestError, NotFoundError } from "@/modules/shared/utils/errors";
import {
  OrderStatusSchema,
  type CreateCompleteOrderItemDTO,
  type DeliveryMethod,
  type OrderStatus,
  type PaymentMethod,
} from "./order.model";
import { OrderBuilderImpl, OrderItemBuilderImpl } from "./order.builder";
import type { OrderRepository } from "./order.repository";
import type { ToppingRepository } from "@/modules/catalog/toppings/topping.repository";
import type { CartRepository } from "../carts/cart.repository";
import type { DrinkVariant } from "@/modules/catalog/variants/variant.model";
import type { Topping } from "@/modules/catalog/toppings/topping.model";
import orderRepository from "./order.repository";
import drinkVariantRepository from "@/modules/catalog/variants/variant.repository";
import toppingRepository from "@/modules/catalog/toppings/topping.repository";
import cartRepository from "@/modules/sales/carts/cart.repository";

class OrderService {
  private readonly orderRepository: OrderRepository;
  private readonly drinkVariantRepository: DrinkVariantRepository;
  private readonly toppingRepository: ToppingRepository;
  private readonly cartRepository: CartRepository;
  private readonly orderBuilder: OrderBuilderImpl;
  private readonly orderItemBuilder: OrderItemBuilderImpl;

  constructor(
    orderRepository: OrderRepository,
    drinkVariantRepository: DrinkVariantRepository,
    toppingRepository: ToppingRepository,
    cartRepository: CartRepository,
  ) {
    this.orderRepository = orderRepository;
    this.drinkVariantRepository = drinkVariantRepository;
    this.toppingRepository = toppingRepository;
    this.cartRepository = cartRepository;
    this.orderBuilder = new OrderBuilderImpl();
    this.orderItemBuilder = new OrderItemBuilderImpl();
  }

  updateOrderStatus = async (id: string, status: OrderStatus) => {
    const safeStatus = OrderStatusSchema.safeParse(status);
    if (!safeStatus.success) {
      throw new BadRequestError(
        "Failed to update order status",
        "VALIDATION_ERROR",
      );
    }

    const updatedOrder = await this.orderRepository.updateOrderStatus(
      id,
      status,
    );
    if (!updatedOrder) {
      throw new NotFoundError(
        "Failed to update order status",
        "OBJECT_NOT_FOUND",
      );
    }
    return updatedOrder;
  };

  createOrder = async (
    customerId: string,
    delivery: { method: DeliveryMethod; address?: string },
    paymentMethod: PaymentMethod,
  ) => {
    return await db.transaction(async (trx) => {
      // Fetch the payload from the customer's cart
      const customerCart =
        await this.cartRepository.getCompleteCartByCustomerId(customerId, trx);

      if (!customerCart) {
        throw new NotFoundError(
          "Failed to create order - cart not found",
          "OBJECT_NOT_FOUND",
        );
      }

      const { items } = customerCart;
      if (!items || items.length === 0) {
        throw new BadRequestError(
          "Failed to create order - cart is empty",
          "VALIDATION_ERROR",
        );
      }

      const builtOrderItems: CreateCompleteOrderItemDTO[] = [];
      const fetchedVariants = new Map<string, DrinkVariant>();
      const fetchedToppings = new Map<string, Topping>();

      for (const item of items) {
        let drinkVariant: DrinkVariant | null =
          fetchedVariants.get(item.drinkVariantId) ||
          (await this.drinkVariantRepository.getById(item.drinkVariantId, trx));

        if (!drinkVariant) {
          throw new NotFoundError(
            `Drink variant with ID ${item.drinkVariantId} not found`,
            "OBJECT_NOT_FOUND",
          );
        }
        fetchedVariants.set(item.drinkVariantId, drinkVariant);

        let toppings: Array<{ topping: Topping; quantity: number }> = [];
        if (item.toppings && item.toppings.length > 0) {
          const toppingsPromise = item.toppings.map(async (t) => {
            const cachedTopping = fetchedToppings.get(t.id);
            const topping =
              cachedTopping ||
              (await this.toppingRepository.getById(t.id, trx));

            if (topping) {
              fetchedToppings.set(t.id, topping);
              return { topping, quantity: t.quantity ?? 1 };
            }

            return null;
          });

          const resolvedToppings = await Promise.all(toppingsPromise);
          const validToppings = resolvedToppings.filter(
            (t) => t !== null,
          ) as Array<{ topping: Topping; quantity: number }>;

          if (validToppings.length !== item.toppings.length) {
            throw new NotFoundError(
              "Failed to create order - some toppings not found",
              "OBJECT_NOT_FOUND",
            );
          }

          toppings = validToppings;
        }

        const builtItem = this.orderItemBuilder
          .setVariant(drinkVariant)
          .setQuantity(item.quantity ?? 1)
          .setIceLevel(item.iceLevel ?? "normal_ice")
          .setSugarLevel(item.sugarLevel ?? "100%")
          .addToppings(toppings)
          .return();

        builtOrderItems.push(builtItem);
        this.orderItemBuilder.reset();
      }

      const completeOrder = this.orderBuilder
        .setCustomer(customerId)
        .setDeliveryMethod(delivery.method, delivery.address)
        .setPaymentMethod(paymentMethod)
        .addItems(builtOrderItems)
        .return();

      await this.cartRepository.deleteCart(customerCart.id, trx);

      return await this.orderRepository.createOrder(completeOrder, trx);
    });
  };

  getOrderCompleteInfo = async (id: string) => {
    const order = await this.orderRepository.getOrderWithCompleteInfo(id);
    if (!order) {
      throw new NotFoundError("Failed to get order info", "OBJECT_NOT_FOUND");
    }
    return order;
  };

  getOrdersCompleteInfo = async (queryParams: {
    status?: OrderStatus;
    customerId?: string;
  }) => {
    const order =
      await this.orderRepository.getOrdersWithCompleteInfo(queryParams);
    if (!order) {
      throw new NotFoundError("Failed to get order info", "OBJECT_NOT_FOUND");
    }
    return order;
  };

  getOrderWithPopulatedInfo = async (id: string) => {
    const order = await this.orderRepository.getOrderWithPopulatedInfo(id);
    if (!order) {
      throw new NotFoundError("Failed to get order info", "OBJECT_NOT_FOUND");
    }
    return order;
  };

  getOrdersWithPopulatedInfo = async (queryParams: {
    status?: OrderStatus;
    customerId?: string;
  }) => {
    const order =
      await this.orderRepository.getOrdersWithPopulatedInfo(queryParams);
    if (!order) {
      throw new NotFoundError("Failed to get order info", "OBJECT_NOT_FOUND");
    }
    return order;
  };
}

export type { OrderService };
export default new OrderService(
  orderRepository,
  drinkVariantRepository,
  toppingRepository,
  cartRepository,
);

import db from "@/core/db/knex";
import { type DrinkVariantRepository } from "@/modules/catalog/variants/variant.repository";
import { BadRequestError, NotFoundError } from "@/modules/shared/utils/errors";
import { OrderStatusSchema, type CreateCompleteOrderItemDTO, type OrderStatus } from "./order.model";
import type { OrderRepository } from "./order.repository";
import { OrderBuilderImpl, OrderItemBuilderImpl } from "./order.builder";
import type { ToppingRepository } from "@/modules/catalog/toppings/topping.repository";
import type { DrinkVariant } from "@/modules/catalog/variants/variant.model";
import type { Topping } from "@/modules/catalog/toppings/topping.model";
import orderRepository from "./order.repository";
import drinkVariantRepository from "@/modules/catalog/variants/variant.repository";
import toppingRepository from "@/modules/catalog/toppings/topping.repository";
import type { OrderRequestPayload } from "./order.controller";

class OrderService {
  private readonly orderRepository: OrderRepository;
  private readonly drinkVariantRepository: DrinkVariantRepository;
  private readonly toppingRepository: ToppingRepository;
  private readonly orderBuilder: OrderBuilderImpl;
  private readonly orderItemBuilder: OrderItemBuilderImpl;

  constructor(
    orderRepository: OrderRepository,
    drinkVariantRepository: DrinkVariantRepository,
    toppingRepository: ToppingRepository,
  ) {
    this.orderRepository = orderRepository;
    this.drinkVariantRepository = drinkVariantRepository;
    this.toppingRepository = toppingRepository;
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

  createOrder = async (orderPayload: OrderRequestPayload) => {
    return await db.transaction(async (trx) => {
      const builtOrderItems: CreateCompleteOrderItemDTO[] = [];
      const fetchedVariants = new Map<string, DrinkVariant>();
      const fetchedToppings = new Map<string, Topping>();

      for (const item of orderPayload.items) {
        let drinkVariant: DrinkVariant | null =
          fetchedVariants.get(item.orderVariantId) ||
          (await this.drinkVariantRepository.getById(
            item.orderVariantId,
            trx,
          ));

        if (!drinkVariant) {
          throw new NotFoundError(
            `Drink variant with ID ${item.orderVariantId} not found`,
            "OBJECT_NOT_FOUND",
          );
        }
        fetchedVariants.set(item.orderVariantId, drinkVariant);

        let toppings: Array<{ topping: Topping; quantity: number }> = [];
        if (item.toppings && item.toppings.length > 0) {
          const toppingsPromise = item.toppings.map(async (t) => {
            const cachedTopping = fetchedToppings.get(t.id);
            const topping = cachedTopping || await this.toppingRepository.getToppingById(t.id, trx);

            if (topping) {
              fetchedToppings.set(t.id, topping);
              return { topping, quantity: t.quantity ?? 1 };
            }

            return null;
          });

          const resolvedToppings = await Promise.all(toppingsPromise);
          const validToppings = resolvedToppings.filter((t) => t !== null) as Array<{ topping: Topping; quantity: number }>;

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
        .setCustomer(orderPayload.customerId)
        .setDeliveryMethod(
          orderPayload.deliveryMethod,
          orderPayload.deliveryAddress,
        )
        .addItems(builtOrderItems)
        .return();

      return await this.orderRepository.createOrder(completeOrder, trx);
    });
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
}

export type { OrderService };
export default new OrderService(
  orderRepository,
  drinkVariantRepository,
  toppingRepository,
);

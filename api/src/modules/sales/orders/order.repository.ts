import type { Knex } from "knex";
import {
  CompleteOrderSchema,
  OrderItemSchema,
  OrderItemToppingSchema,
  OrderSchema,
  type CompleteOrder,
  type CreateCompleteOrderDTO,
  type Order,
  type OrderStatus,
} from "./order.model";
import db from "@/core/db/knex";
import camelcaseKeys from "camelcase-keys";
import snakecaseKeys from "snakecase-keys";

declare module "knex/types/tables" {
  interface Tables {
    orders: Knex.CompositeTableType<
      Record<string, any>,
      Record<string, any>,
      Record<string, any>
    >;
  }
}

class OrderRepository {
  private readonly knex: Knex;

  constructor(knex: Knex) {
    this.knex = knex;
  }

  private conn(trx?: Knex | Knex.Transaction) {
    return trx || this.knex;
  }

  getOrderWithCompleteInfo = async (id: string, trx?: Knex | Knex.Transaction): Promise<CompleteOrder | null> => {
    const performQuery = async (connection: Knex | Knex.Transaction) => {
      const dbOrder = await connection("orders").where({ id }).first();
      if (!dbOrder) return null;

      const dbItems = await connection("order_items")
        .where({ order_id: id })
        .select("*");

      const itemIds = dbItems.map((item) => item.id);
      const dbToppings =
        itemIds.length > 0
          ? await connection("order_item_toppings")
              .whereIn("order_item_id", itemIds)
              .select("*")
          : [];

      const itemsWithToppings = dbItems.map((item) => ({
        ...camelcaseKeys(item, { deep: true }),
        orderId: item.order_id,
        toppings: dbToppings
          .map((topping) => camelcaseKeys(topping, { deep: true }))
          .filter((topping) => topping.orderItemId === item.id),
      }));

      const completeOrder = {
        ...OrderSchema.parse(camelcaseKeys(dbOrder, { deep: true })),
        items: itemsWithToppings,
      };

      return CompleteOrderSchema.parse(completeOrder);
    };

    return trx ? performQuery(trx) : this.knex.transaction(performQuery);
  };

  getOrdersWithCompleteInfo = async (
    queryParams: {
      status?: OrderStatus;
      customerId?: string;
    },
    trx?: Knex | Knex.Transaction
  ): Promise<CompleteOrder[]> => {
    const performQuery = async (connection: Knex | Knex.Transaction) => {
      const { status, customerId } = queryParams;

      const query = connection("orders").select("*");
      if (status) query.where({ status });
      if (customerId) query.where({ customer_id: customerId });

      const dbOrders = await query;
      if (!dbOrders || dbOrders.length === 0) return [];

      const orderIds = dbOrders.map((order) => order.id);
      const dbItems = await connection("order_items")
        .whereIn("order_id", orderIds)
        .select("*");

      const itemIds = dbItems.map((item) => item.id);
      const dbToppings =
        itemIds.length > 0
          ? await connection("order_item_toppings")
              .whereIn("order_item_id", itemIds)
              .select("*")
          : [];

      const itemsWithToppings = dbItems.map((item) => ({
        ...camelcaseKeys(item, { deep: true }),
        orderId: item.order_id,
        toppings: dbToppings
          .map((topping) => camelcaseKeys(topping, { deep: true }))
          .filter((topping) => topping.orderItemId === item.id),
      }));

      const completeOrders = dbOrders.map((order) => {
        const orderItems = itemsWithToppings
          .filter((item) => item.orderId === order.id);

        return {
          ...OrderSchema.parse(camelcaseKeys(order, { deep: true })),
          items: orderItems,
        };
      });

      return completeOrders.map((order) => CompleteOrderSchema.parse(order));
    };

    return trx ? performQuery(trx) : this.knex.transaction(performQuery);
  };

  getAllOrders = async (trx?: Knex | Knex.Transaction): Promise<Order[]> => {
    const orders = await this.conn(trx)("orders").select("*");
    return orders.map((order) =>
      OrderSchema.parse(camelcaseKeys(order, { deep: true })),
    );
  };

  getOrderById = async (id: string, trx?: Knex | Knex.Transaction): Promise<Order | null> => {
    const order = await this.conn(trx)("orders").where({ id }).first();
    if (!order) return null;
    return OrderSchema.parse(camelcaseKeys(order, { deep: true }));
  };

  updateOrderStatus = async (
    id: string,
    status: OrderStatus,
    trx?: Knex | Knex.Transaction
  ): Promise<Order | null> => {
    const [updatedOrder] = await this.conn(trx)("orders")
      .where({ id })
      .update({ status })
      .returning("*");
    if (!updatedOrder) return null;
    return OrderSchema.parse(camelcaseKeys(updatedOrder, { deep: true }));
  };

  createOrder = async (
    order: CreateCompleteOrderDTO,
    trx?: Knex | Knex.Transaction
  ): Promise<CompleteOrder> => {
    const performInsert = async (connection: Knex | Knex.Transaction) => {
      const { items, ...orderData } = order;

      const dbOrderData = snakecaseKeys(orderData, { deep: true });
      const [insertedOrder] = await connection("orders")
        .insert(dbOrderData)
        .returning("*");

      if (!items || items.length === 0) {
        throw new Error("Order must contain at least one item");
      }

      const itemsToInsert = items.map((item) => {
        const { toppings, ...itemData } = item;
        return snakecaseKeys({
          ...itemData,
          orderId: insertedOrder.id,
        });
      });

      const insertedItems = await connection("order_items")
        .insert(itemsToInsert)
        .returning("*");

      const toppingsToInsert: any[] = [];
      items.forEach((item, index) => {
        if (item.toppings && item.toppings.length > 0) {
          const currentItemId = insertedItems[index].id;
          item.toppings.forEach((topping) => {
            toppingsToInsert.push(
              snakecaseKeys({ ...topping, orderItemId: currentItemId }),
            );
          });
        }
      });

      let insertedToppings: any[] = [];
      if (toppingsToInsert.length > 0) {
        insertedToppings = await connection("order_item_toppings")
          .insert(toppingsToInsert)
          .returning("*");
      }

      const parsedToppings = insertedToppings.map((topping) =>
        OrderItemToppingSchema.parse(camelcaseKeys(topping, { deep: true })),
      );

      const completeItems = insertedItems.map((item) => {
        const parsedItem = OrderItemSchema.parse(
          camelcaseKeys(item, { deep: true }),
        );
        return {
          ...parsedItem,
          toppings: parsedToppings.filter(
            (topping) => topping.orderItemId === parsedItem.id,
          ),
        };
      });

      const completeOrder = {
        ...OrderSchema.parse(camelcaseKeys(insertedOrder, { deep: true })),
        items: completeItems,
      };

      return CompleteOrderSchema.parse(completeOrder);
    };

    return trx ? performInsert(trx) : this.knex.transaction(performInsert);
  };
}

export type { OrderRepository };
export default new OrderRepository(db);
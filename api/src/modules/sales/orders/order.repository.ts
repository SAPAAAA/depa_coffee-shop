import type { Knex } from "knex";
import {
  CompleteOrderSchema,
  OrderItemSchema,
  OrderItemToppingSchema,
  OrderSchema,
  PopulatedOrderSchema,
  type CompleteOrder,
  type CreateCompleteOrderDTO,
  type Order,
  type OrderStatus,
  type PopulatedOrder,
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

  getOrderWithCompleteInfo = async (
    id: string,
    trx?: Knex | Knex.Transaction,
  ): Promise<CompleteOrder | null> => {
    const connection = this.conn(trx);
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

  getOrdersWithCompleteInfo = async (
    queryParams: {
      status?: OrderStatus;
      customerId?: string;
    },
    trx?: Knex | Knex.Transaction,
  ): Promise<CompleteOrder[]> => {
    const connection = this.conn(trx);
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
      const orderItems = itemsWithToppings.filter(
        (item) => item.orderId === order.id,
      );

      return {
        ...OrderSchema.parse(camelcaseKeys(order, { deep: true })),
        items: orderItems,
      };
    });

    return completeOrders.map((order) => CompleteOrderSchema.parse(order));
  };

  getOrdersWithPopulatedInfo = async (
    queryParams: {
      status?: OrderStatus;
      customerId?: string;
    },
    trx?: Knex | Knex.Transaction,
  ): Promise<PopulatedOrder[]> => {
    const connection = this.conn(trx);
    const { status, customerId } = queryParams;
    const dbOrdersQuery = connection("orders").select("*");
    if (status) dbOrdersQuery.where({ status });
    if (customerId) dbOrdersQuery.where({ customer_id: customerId });

    const dbOrders = await dbOrdersQuery;
    if (!dbOrders || dbOrders.length === 0) return [];
    const orderIds = dbOrders.map((order) => order.id);
    const dbItems = await connection("order_items")
      .leftJoin(
        "drink_variants",
        "order_items.drink_variant_id",
        "drink_variants.id",
      )
      .whereIn("order_id", orderIds)
      .select(
        "order_items.*",
        connection.raw(`
          json_build_object(
            'id', drink_variants.id,
            'drink_id', drink_variants.drink_id,
            'name', drink_variants.name,
            'price', drink_variants.price,
            'volume_ml', drink_variants.volume_ml
          ) as drink_variant
        `),
      )
      .groupBy("order_items.id", "drink_variants.id");

    const itemIds = dbItems.map((item) => item.id);
    const dbToppings =
      itemIds.length > 0
        ? await connection("order_item_toppings")
            .leftJoin(
              "toppings",
              "order_item_toppings.topping_id",
              "toppings.id",
            )
            .whereIn("order_item_id", itemIds)
            .select(
              "order_item_toppings.*",
              connection.raw(`
                json_build_object(
                  'id', toppings.id,
                  'name', toppings.name,
                  'unit_price', toppings.unit_price
                ) as topping
              `),
            )
            .groupBy(
              "order_item_toppings.order_item_id",
              "order_item_toppings.topping_id",
              "toppings.id",
            )
        : [];

    const itemsWithToppings = dbItems.map((item) => ({
      ...camelcaseKeys(item, { deep: true }),
      orderId: item.order_id,
      toppings: dbToppings
        .map((topping) => camelcaseKeys(topping, { deep: true }))
        .filter((topping) => topping.orderItemId === item.id),
    }));

    const completeOrders = dbOrders.map((order) => {
      const orderItems = itemsWithToppings.filter(
        (item) => item.orderId === order.id,
      );

      return {
        ...OrderSchema.parse(camelcaseKeys(order, { deep: true })),
        items: orderItems,
      };
    });

    return completeOrders.map((order) => PopulatedOrderSchema.parse(order));
  };

  getOrderWithPopulatedInfo = async (
    id: string,
    trx?: Knex | Knex.Transaction,
  ): Promise<PopulatedOrder | null> => {
    const connection = this.conn(trx);
    const dbOrder = await connection("orders").where({ id }).first();
    if (!dbOrder) return null;

    const dbItems = await connection("order_items")
      .leftJoin(
        "drink_variants",
        "order_items.drink_variant_id",
        "drink_variants.id",
      )
      .where({ order_id: id })
      .select(
        "order_items.*",
        connection.raw(`
          json_build_object(
            'id', drink_variants.id,
            'drink_id', drink_variants.drink_id,
            'name', drink_variants.name,
            'price', drink_variants.price,
            'volume_ml', drink_variants.volume_ml
          ) as drink_variant
        `),
      )
      .groupBy("order_items.id", "drink_variants.id");

    const itemIds = dbItems.map((item) => item.id);
    const dbToppings =
      itemIds.length > 0
        ? await connection("order_item_toppings")
            .leftJoin(
              "toppings",
              "order_item_toppings.topping_id",
              "toppings.id",
            )
            .whereIn("order_item_toppings.order_item_id", itemIds)
            .select(
              "order_item_toppings.*",
              connection.raw(`
                json_build_object(
                  'id', toppings.id,
                  'name', toppings.name,
                  'unit_price', toppings.unit_price
                ) as topping
              `),
            )
            .groupBy(
              "order_item_toppings.order_item_id",
              "order_item_toppings.topping_id",
              "toppings.id",
            )
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

    return PopulatedOrderSchema.parse(completeOrder);
  };

  getAllOrders = async (trx?: Knex | Knex.Transaction): Promise<Order[]> => {
    const orders = await this.conn(trx)("orders").select("*");
    return orders.map((order) =>
      OrderSchema.parse(camelcaseKeys(order, { deep: true })),
    );
  };

  getOrderById = async (
    id: string,
    trx?: Knex | Knex.Transaction,
  ): Promise<Order | null> => {
    const order = await this.conn(trx)("orders").where({ id }).first();
    if (!order) return null;
    return OrderSchema.parse(camelcaseKeys(order, { deep: true }));
  };

  updateOrderStatus = async (
    id: string,
    status: OrderStatus,
    trx?: Knex | Knex.Transaction,
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
    trx?: Knex | Knex.Transaction,
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
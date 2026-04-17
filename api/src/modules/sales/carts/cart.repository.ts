import type { Knex } from "knex";
import snakecaseKeys from "snakecase-keys";
import {
  CompleteCartItemSchema,
  CompleteCartSchema,
  type CartItem,
  type CompleteCartItemTopping,
  type CreateCompleteCartDTO,
  type CreateCompleteCartItemDTO,
  type UpdateCompleteCartDTO,
  type UpdateCompleteCartItemDTO,
} from "./cart.model";
import db from "@/core/db/knex";
import camelcaseKeys from "camelcase-keys";

declare module "knex/types/tables" {
  interface Tables {
    carts: Knex.CompositeTableType<
      Record<string, any>,
      Record<string, any>,
      Record<string, any>,
      Record<string, any>
    >;
    cart_items: Knex.CompositeTableType<
      Record<string, any>,
      Record<string, any>,
      Record<string, any>,
      Record<string, any>
    >;
  }
}

class CartRepository {
  private readonly knex: Knex;

  constructor(knex: Knex) {
    this.knex = knex;
  }

  private readonly conn = (trx?: Knex | Knex.Transaction) => {
    return trx || this.knex;
  };

  getById = async (cartId: string, trx?: Knex | Knex.Transaction) => {
    const cart = await this.conn(trx)("carts").where({ id: cartId }).first();
    return cart || null;
  };

  getByCustomerId = async (
    customerId: string,
    trx?: Knex | Knex.Transaction,
  ) => {
    const cart = await this.conn(trx)("carts")
      .where({ customer_id: customerId })
      .first();
    return cart || null;
  };

  getCompleteCartByCustomerId = async (
    customerId: string,
    trx?: Knex | Knex.Transaction,
  ) => {
    const cart = await this.conn(trx)("carts")
      .where({ customer_id: customerId })
      .first();

    if (!cart) return null;

    // Fetch the items associated with the cart
    const cartItems = await this.conn(trx)("cart_items").where({
      cart_id: cart.id,
    });

    let itemsWithToppings: any[] = [];

    if (cartItems.length > 0) {
      const itemIds = cartItems.map((item) => item.id);

      // Fetch the toppings for all the fetched cart items
      const toppings = await this.conn(trx)("cart_item_toppings").whereIn(
        "cart_item_id",
        itemIds,
      );

      itemsWithToppings = cartItems.map((item) => {
        const itemToppings = toppings
          .filter((t) => t.cart_item_id === item.id)
          .map((t) => ({
            id: t.topping_id,
            quantity: t.quantity,
          }));

        return {
          ...camelcaseKeys(item, { deep: true }),
          toppings: itemToppings,
        };
      });
    }

    const completeCart = {
      ...camelcaseKeys(cart, { deep: true }),
      items: itemsWithToppings,
    };

    // Parse and return the CompleteCart schema
    return CompleteCartSchema.parse(completeCart);
  };

  createCart = async (
    customerId: string,
    payload: CreateCompleteCartDTO,
    trx?: Knex | Knex.Transaction,
  ) => {
    const dbPayload = snakecaseKeys(payload, { deep: true });

    const [createdCart] = await this.conn(trx)("carts")
      .insert({
        customer_id: customerId,
      })
      .returning("*");

    let createdCartWithItems = camelcaseKeys(createdCart, { deep: true });

    if (dbPayload.items && dbPayload.items.length > 0) {
      // Handle cart items insertion
      const cartItemsPayload = dbPayload.items.map((item) => {
        const { toppings, ...rest } = item;
        return {
          ...rest,
          cart_id: createdCart.id,
        };
      });
      const createdCartItems = await this.conn(trx)("cart_items")
        .insert(cartItemsPayload)
        .returning("*");

      createdCartWithItems = {
        ...createdCartWithItems,
        items: createdCartItems.map((item) =>
          camelcaseKeys(item, { deep: true }),
        ) as CartItem[],
      };

      // Handle toppings insertion
      const toppingsPayload = dbPayload.items.flatMap((item, index) => {
        const { toppings } = item;
        if (!toppings || toppings.length === 0) return [];
        return toppings.map((topping) => ({
          cart_item_id: createdCartItems[index].id,
          topping_id: topping.id,
          quantity: topping.quantity || 1,
        }));
      });
      if (toppingsPayload.length > 0) {
        const createdToppings = await this.conn(trx)("cart_item_toppings")
          .insert(toppingsPayload)
          .returning("*");

        // Map toppings back to cart items
        const toppingsByCartItemId: Record<string, CompleteCartItemTopping[]> =
          {};
        createdToppings.forEach((topping) => {
          const cartItemId = topping.cart_item_id;
          if (!toppingsByCartItemId[cartItemId]) {
            toppingsByCartItemId[cartItemId] = [];
          }
          toppingsByCartItemId[cartItemId].push({
            id: topping.topping_id,
            quantity: topping.quantity,
          });
        });

        createdCartWithItems.items = createdCartWithItems.items.map(
          (item: CartItem) => ({
            ...item,
            toppings: toppingsByCartItemId[item.id] || [],
          }),
        );
      }
    }

    return CompleteCartSchema.parse(createdCartWithItems);
  };

  updateCartItem = async (
    itemId: string,
    payload: UpdateCompleteCartItemDTO,
    trx?: Knex | Knex.Transaction,
  ) => {
    const dbPayload = snakecaseKeys(payload, { deep: true });
    const toppings = payload.toppings;
    
    let updatedCartItem = {};
    let updatedCartItemToppings: any[] = [];

    if (toppings) {
      await this.conn(trx)("cart_item_toppings")
        .where({ cart_item_id: itemId })
        .del();
      const toppingsPayload = toppings.map((topping) => ({
        cart_item_id: itemId,
        topping_id: topping.id,
        quantity: topping.quantity || 1,
      }));
      updatedCartItemToppings = await this.conn(trx)("cart_item_toppings")
        .insert(toppingsPayload)
        .onConflict(["cart_item_id", "topping_id"])
        .merge()
        .returning("*");
    }

    [updatedCartItem] = await this.conn(trx)("cart_items")
      .where({ id: itemId })
      .update(dbPayload)
      .returning("*");

    const updatedCartItemWithToppings = {
      ...updatedCartItem,
      toppings: updatedCartItemToppings.map((topping) => ({
        id: topping.topping_id,
        quantity: topping.quantity,
      })),
    };
    return CompleteCartItemSchema.parse(
      camelcaseKeys(updatedCartItemWithToppings, { deep: true }),
    );
  }

  createCartItem = async (
    cartId: string,
    payload: CreateCompleteCartItemDTO,
    trx?: Knex | Knex.Transaction,
  ) => {
    const dbPayload = snakecaseKeys(payload, { deep: true });
    const { toppings, ...cartItemData } = dbPayload;

    const [createdCartItem] = await this.conn(trx)("cart_items")
      .insert({
        ...cartItemData,
        cart_id: cartId,
      })
      .returning("*");

    let createdCartItemWithToppings = camelcaseKeys(createdCartItem, {
      deep: true,
    });

    if (toppings && toppings.length > 0) {
      const toppingsPayload = toppings.map((topping) => ({
        cart_item_id: createdCartItem.id,
        topping_id: topping.id,
        quantity: topping.quantity || 1,
      }));
      const createdToppings = await this.conn(trx)("cart_item_toppings")
        .insert(toppingsPayload)
        .returning("*");

      createdCartItemWithToppings = {
        ...createdCartItemWithToppings,
        toppings: createdToppings.map((t) => ({
          id: t.topping_id,
          quantity: t.quantity,
        })),
      };
    } else {
      createdCartItemWithToppings = {
        ...createdCartItemWithToppings,
        toppings: [],
      };
    }

    return CompleteCartItemSchema.parse(createdCartItemWithToppings);
  };

  updateCart = async (
    cartId: string,
    payload: UpdateCompleteCartDTO,
    trx?: Knex | Knex.Transaction,
  ) => {
    const dbPayload = snakecaseKeys(payload, { deep: true });
    const { items, ...cartUpdateData } = dbPayload;

    let updatedCartItems: any[] = [];
    let updatedToppingsByCartItemId: Record<string, CompleteCartItemTopping[]> =
      {};

    if (items) {
      // delete items that are not in the incoming payload
      const incomingItemIds = items.map((item: any) => item.id).filter(Boolean);

      const itemsToDelete = await this.conn(trx)("cart_items")
        .where({ cart_id: cartId })
        .whereNotIn("id", incomingItemIds)
        .select("id");

      const idsToDelete = itemsToDelete.map((item) => item.id);

      if (idsToDelete.length > 0) {
        await Promise.all([
          this.conn(trx)("cart_items").whereIn("id", idsToDelete).del(),
          this.conn(trx)("cart_item_toppings")
            .whereIn("cart_item_id", incomingItemIds)
            .del(),
        ]);
      }

      // Upsert incoming items
      const cartItemsPayload = items.map((item: any) => {
        const { toppings, ...rest } = item;
        return {
          ...rest,
          cart_id: cartId,
        };
      });

      if (cartItemsPayload.length > 0) {
        updatedCartItems = await this.conn(trx)("cart_items")
          .insert(cartItemsPayload)
          .onConflict("id")
          .merge()
          .returning("*");
      }

      const toppingsPayload = items.flatMap((item: any) => {
        const { toppings } = item;
        if (!toppings || toppings.length === 0) return [];
        return toppings.map((topping: any) => ({
          cart_item_id: item.id,
          topping_id: topping.id,
          quantity: topping.quantity || 1,
        }));
      });

      if (toppingsPayload.length > 0) {
        const updatedToppings = await this.conn(trx)("cart_item_toppings")
          .insert(toppingsPayload)
          .onConflict(["cart_item_id", "topping_id"])
          .merge()
          .returning("*");

        updatedToppings.forEach((topping: any) => {
          const cartItemId = topping.cart_item_id;
          if (!updatedToppingsByCartItemId[cartItemId]) {
            updatedToppingsByCartItemId[cartItemId] = [];
          }
          updatedToppingsByCartItemId[cartItemId].push({
            id: topping.topping_id,
            quantity: topping.quantity,
          });
        });
      }
    }

    let updatedCart;
    if (Object.keys(cartUpdateData).length > 0) {
      const [result] = await this.conn(trx)("carts")
        .where({ id: cartId })
        .update(cartUpdateData)
        .returning("*");
      updatedCart = result;
    } else {
      [updatedCart] = await this.conn(trx)("carts")
        .update({ updated_at: this.conn(trx).fn.now() })
        .where({ id: cartId })
        .returning("*");
    }

    if (!items) {
      const existingItems = await this.conn(trx)("cart_items").where({
        cart_id: cartId,
      });
      updatedCartItems = existingItems;
    }

    const completeCartWithItems = {
      ...camelcaseKeys(updatedCart, { deep: true }),
      items: updatedCartItems.map((item) => ({
        ...camelcaseKeys(item, { deep: true }),
        toppings: updatedToppingsByCartItemId[item.id] || [],
      })),
    };

    return CompleteCartSchema.parse(completeCartWithItems);
  };

  updateCartItem = async (
    cartId: string,
    itemId: string,
    payload: Partial<CreateCompleteCartItemDTO>,
    trx?: Knex | Knex.Transaction,
  ) => {
    const dbPayload = snakecaseKeys(payload, { deep: true });
    const toppings = payload.toppings;

    let updatedCartItem = {};
    let updatedCartItemToppings: any[] = [];

    if (toppings) {
      await this.conn(trx)("cart_item_toppings")
        .where({ cart_item_id: itemId })
        .del();
      const toppingsPayload = toppings.map((topping) => ({
        cart_item_id: itemId,
        topping_id: topping.id,
        quantity: topping.quantity || 1,
      }));
      updatedCartItemToppings = await this.conn(trx)("cart_item_toppings")
        .insert(toppingsPayload)
        .onConflict(["cart_item_id", "topping_id"])
        .merge()
        .returning("*");
    }

    [updatedCartItem] = await this.conn(trx)("cart_items")
      .where({ id: itemId, cart_id: cartId })
      .update(dbPayload)
      .returning("*");

    const updatedCartItemWithToppings = {
      ...updatedCartItem,
      toppings: updatedCartItemToppings.map((topping) => ({
        id: topping.topping_id,
        quantity: topping.quantity,
      })),
    };
    return CompleteCartItemSchema.parse(
      camelcaseKeys(updatedCartItemWithToppings, { deep: true }),
    );
  };

  deleteCart = async (cartId: string, trx?: Knex | Knex.Transaction) => {
    await this.conn(trx)("carts").where({ id: cartId }).del();
  };
}

export default new CartRepository(db);
export type { CartRepository };

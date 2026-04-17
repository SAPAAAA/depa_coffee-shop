import drinkVariantRepository, {
  type DrinkVariantRepository,
} from "@/modules/catalog/variants/variant.repository";
import drinkRepository, {
  type DrinkRepository,
} from "@/modules/catalog/drinks/drink.repository";
import toppingRepository, {
  type ToppingRepository,
} from "@/modules/catalog/toppings/topping.repository";

import type {
  CreateCompleteCartDTO,
  CreateCompleteCartItemDTO,
  UpdateCompleteCartDTO,
  UpdateCompleteCartItemDTO,
} from "./cart.model";
import type { CartRepository } from "./cart.repository";
import cartRepository from "./cart.repository";
import { ForbiddenError, NotFoundError } from "@/modules/shared/utils/errors";
import db from "@/core/db/knex";

class CartService {
  private readonly cartRepository: CartRepository;
  private readonly drinkRepository: DrinkRepository;
  private readonly drinkVariantRepository: DrinkVariantRepository;
  private readonly toppingRepository: ToppingRepository;

  constructor(
    cartRepository: CartRepository,
    drinkRepository: DrinkRepository,
    drinkVariantRepository: DrinkVariantRepository,
    toppingRepository: ToppingRepository,
  ) {
    this.cartRepository = cartRepository;
    this.drinkRepository = drinkRepository;
    this.drinkVariantRepository = drinkVariantRepository;
    this.toppingRepository = toppingRepository;
  }

  getCartByCustomerId = async (customerId: string) => {
    return await this.cartRepository.getByCustomerId(customerId);
  };

  getCustomerCompleteCart = async (customerId: string) => {
    return await this.cartRepository.getCompleteCartByCustomerId(customerId);
  };

  createCart = async (customerId: string, payload: CreateCompleteCartDTO) => {
    const existingCart = await this.cartRepository.getByCustomerId(customerId);
    if (existingCart) {
      const completeCart =
        await this.cartRepository.getCompleteCartByCustomerId(customerId);
      return completeCart;
    }

    return await this.cartRepository.createCart(customerId, payload);
  };

  createCartItem = async (
    customerId: string,
    cartId: string,
    payload: CreateCompleteCartItemDTO,
  ) => {
    // Verify ownership
    return await db.transaction(async (trx) => {
      const cart = await this.cartRepository.getByCustomerId(customerId, trx);
      if (cart?.id !== cartId) {
        throw new ForbiddenError("Failed to add item to cart", "FORBIDDEN");
      }

      const variant = await this.drinkVariantRepository.getById(
        payload.drinkVariantId,
        trx,
      );
      if (!variant) {
        throw new NotFoundError("Drink variant not found", "OBJECT_NOT_FOUND");
      }

      if (variant.stockQuantity < (payload.quantity ?? 1)) {
        throw new ForbiddenError(
          "Insufficient stock for the selected drink variant",
          "FORBIDDEN",
        );
      }

      // Validate toppings if provided
      const toppingsPromise = Promise.all(
        (payload.toppings ?? []).map(async (t) => {
          const topping = await this.toppingRepository.getById(t.id, trx);
          if (!topping) {
            throw new NotFoundError(
              `Topping variant with ID ${t.id} not found`,
              "OBJECT_NOT_FOUND",
            );
          }

          if (topping.stockQuantity < (t.quantity ?? 1)) {
            throw new ForbiddenError(
              `Insufficient stock for the selected topping ${topping.name}`,
              "FORBIDDEN",
            );
          }

          return {
            ...t,
            topping,
          };
        }),
      );

      await toppingsPromise;

      // All validations passed, create the cart item
      const createdCartItem = await this.cartRepository.createCartItem(
        cartId,
        payload,
        trx,
      );

      if (createdCartItem.cartId !== cartId) {
        throw new ForbiddenError("Failed to add item to cart", "FORBIDDEN");
      }

      return createdCartItem;
    });
  };

  updateCartItem = async (
    customerId: string,
    cartId: string,
    itemId: string,
    payload: UpdateCompleteCartItemDTO,
  ) => {
    // Verify ownership
    return await db.transaction(async (trx) => {
      const cart = await this.cartRepository.getByCustomerId(customerId, trx);
      if (cart?.id !== cartId) {
        throw new ForbiddenError("Failed to update cart item", "FORBIDDEN");
      }

      const variantStillAvailable =
        await this.drinkVariantRepository.checkVariantStock(
          payload.drinkVariantId,
          payload.quantity ?? 1,
          trx,
        );

      if (!variantStillAvailable) {
        throw new ForbiddenError(
          "Insufficient stock for the selected drink variant",
          "FORBIDDEN",
        );
      }

      // Validate toppings if provided
      const toppingsPromise = Promise.all(
        (payload.toppings ?? []).map(async (t) => {
          if (!t.id) {
            return;
          }
          const topping = await this.toppingRepository.getById(t.id, trx);
          if (!topping) {
            throw new NotFoundError(
              `Topping variant with ID ${t.id} not found`,
              "OBJECT_NOT_FOUND",
            );
          }

          if (topping.stockQuantity < (t.quantity ?? 1)) {
            throw new ForbiddenError(
              `Insufficient stock for the selected topping ${topping.name}`,
              "FORBIDDEN",
            );
          }

          return {
            ...t,
            topping,
          };
        }),
      ).then((results) => results.filter((r) => r !== undefined));

      await toppingsPromise;

      const updatedCartItem = await this.cartRepository.updateCartItem(
        itemId,
        payload,
        trx,
      );

      if (updatedCartItem.cartId !== cartId) {
        throw new ForbiddenError("Failed to update cart item", "FORBIDDEN");
      }

      return await this.cartRepository.getCompleteCartByCustomerId(
        customerId,
        trx,
      );
    });
  };

  updateCart = async (
    customerId: string,
    cartId: string,
    payload: UpdateCompleteCartDTO,
  ) => {
    // Verify ownership
    const cart = await this.cartRepository.getByCustomerId(customerId);
    if (cart?.id !== cartId) {
      throw new ForbiddenError("Failed to update cart", "FORBIDDEN");
    }

    return await this.cartRepository.updateCart(cartId, payload);
  };

  deleteCart = async (customerId: string, cartId: string) => {
    const cart = await this.cartRepository.getByCustomerId(customerId);
    if (cart?.id !== cartId) {
      throw new ForbiddenError("Failed to delete cart", "FORBIDDEN");
    }

    return await this.cartRepository.deleteCart(cartId);
  };

  deleteCartItem = async (
    customerId: string,
    cartId: string,
    itemId: string,
  ) => {
    // Verify ownership
    const cart = await this.cartRepository.getByCustomerId(customerId);
    if (cart?.id !== cartId) {
      throw new ForbiddenError("Failed to remove cart item", "FORBIDDEN");
    }

    return await this.cartRepository.deleteCartItem(itemId);
  };
}

export type { CartService };
export default new CartService(
  cartRepository,
  drinkRepository,
  drinkVariantRepository,
  toppingRepository,
);

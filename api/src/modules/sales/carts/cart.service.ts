import type {
  CreateCompleteCartDTO,
  CreateCompleteCartItemDTO,
  UpdateCompleteCartDTO,
} from "./cart.model";
import type { CartRepository } from "./cart.repository";
import cartRepository from "./cart.repository";
import { ForbiddenError } from "@/modules/shared/utils/errors";
import db from "@/core/db/knex";

class CartService {
  private readonly cartRepository: CartRepository;

  constructor(cartRepository: CartRepository) {
    this.cartRepository = cartRepository;
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
    payload: Partial<CreateCompleteCartItemDTO>,
  ) => {
    // Verify ownership
    return await db.transaction(async (trx) => {
      const cart = await this.cartRepository.getByCustomerId(customerId, trx);
      if (cart?.id !== cartId) {
        throw new ForbiddenError("Failed to update cart item", "FORBIDDEN");
      }

      const updatedCartItem = await this.cartRepository.updateCartItem(
        cartId,
        itemId,
        payload,
        trx,
      );

      if (updatedCartItem.cartId !== cartId) {
        throw new ForbiddenError("Failed to update cart item", "FORBIDDEN");
      }

      return await this.cartRepository.getByCustomerId(customerId, trx);
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
}

export type { CartService };
export default new CartService(cartRepository);

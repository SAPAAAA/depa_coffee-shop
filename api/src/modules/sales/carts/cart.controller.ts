import type { CartService } from "./cart.service";
import type {
  CreateCompleteCartDTO,
  CreateCompleteCartItemDTO,
  UpdateCompleteCartDTO,
  UpdateCompleteCartItemDTO,
} from "./cart.model";
import cartService from "./cart.service";
import type { Request, Response } from "express";
import { UnauthorizedError } from "@/modules/shared/utils/errors";

class CartController {
  private readonly cartService: CartService;

  constructor(cartService: CartService) {
    this.cartService = cartService;
  }

  createCart = async (req: Request, res: Response) => {
    if (!req.user || Array.isArray(req.user) || !req.user.id) {
      throw new UnauthorizedError("Failed to create cart", "UNAUTHORIZED");
    }

    const customerId = req.user.id;
    const payload: CreateCompleteCartDTO = req.body;

    const cart = await this.cartService.createCart(customerId, payload);
    return res.status(201).json({ success: true, data: { cart } });
  };

  createCartItem = async (req: Request, res: Response) => {
    if (!req.user || Array.isArray(req.user) || !req.user.id) {
      throw new UnauthorizedError("Failed to add item to cart", "UNAUTHORIZED");
    }

    const { cartId } = req.params as { cartId: string };
    const customerId = req.user.id;
    const payload: CreateCompleteCartItemDTO = req.body;

    const updatedCart = await this.cartService.createCartItem(
      customerId,
      cartId,
      payload,
    );

    return res.status(201).json({ success: true, data: { cart: updatedCart } });
  };

  getCustomerCompleteCart = async (req: Request, res: Response) => {
    if (!req.user || Array.isArray(req.user) || !req.user.id) {
      throw new UnauthorizedError("Failed to get cart", "UNAUTHORIZED");
    }

    const customerId = req.user.id;

    const cart = await this.cartService.getCustomerCompleteCart(customerId);
    return res.status(200).json({ success: true, data: { cart } });
  };

  updateCartItem = async (req: Request, res: Response) => {
    if (!req.user || Array.isArray(req.user) || !req.user.id) {
      throw new UnauthorizedError("Failed to update cart item", "UNAUTHORIZED");
    }

    const { cartId, itemId } = req.params as { cartId: string; itemId: string };
    const customerId = req.user.id;
    const payload: UpdateCompleteCartItemDTO = req.body;

    const updatedCart = await this.cartService.updateCartItem(
      customerId,
      cartId,
      itemId,
      payload,
    );

    return res.status(200).json({ success: true, data: { cart: updatedCart } });
  };

  updateCart = async (req: Request, res: Response) => {
    if (!req.user || Array.isArray(req.user) || !req.user.id) {
      throw new UnauthorizedError("Failed to update cart", "UNAUTHORIZED");
    }

    const { cartId } = req.params as { cartId: string };
    const customerId = req.user.id;
    const payload: UpdateCompleteCartDTO = req.body;

    const updatedCart = await this.cartService.updateCart(
      customerId,
      cartId,
      payload,
    );

    return res.status(200).json({ success: true, data: { cart: updatedCart } });
  };

  deleteCart = async (req: Request, res: Response) => {
    if (!req.user || Array.isArray(req.user) || !req.user.id) {
      throw new UnauthorizedError("Failed to delete cart", "UNAUTHORIZED");
    }

    const { cartId } = req.params as { cartId: string };
    const customerId = req.user.id;

    await this.cartService.deleteCart(customerId, cartId);

    return res.status(200).json({ success: true });
  };

  deleteCartItem = async (req: Request, res: Response) => {
    if (!req.user || Array.isArray(req.user) || !req.user.id) {
      throw new UnauthorizedError("Failed to remove cart item", "UNAUTHORIZED");
    }

    const { cartId, itemId } = req.params as { cartId: string; itemId: string };
    const customerId = req.user.id;

    const updatedCart = await this.cartService.deleteCartItem(
      customerId,
      cartId,
      itemId,
    );

    return res.status(200).json({ success: true, data: { cart: updatedCart } });
  };
}

export type { CartController };
export default new CartController(cartService);

import { httpClient } from "@/utils/httpClient";
import type { 
  CompleteCart, 
  CompleteCartItem, 
  CreateCompleteCartDTO, 
  CreateCompleteCartItemDTO,
  UpdateCompleteCartDTO,
  UpdateCompleteCartItemDTO,
} from "@api-types/sales/carts/cart.model";

class CartService {
  getCart = async () => {
    const response = await httpClient.get<{ cart: CompleteCart }>(
      "/api/carts/customer",
    );
    return response.cart;
  };

  saveCart = async (payload: CreateCompleteCartDTO) => {
    console.log("Saving cart with payload:", payload);
    const response = await httpClient.post<{ cart: CompleteCart }>(
      "/api/carts",
      payload,
    );
    return response.cart;
  };

  saveCartItem = async (
    cartId: string,
    payload?: CreateCompleteCartItemDTO,
  ) => {
    const response = await httpClient.post<{ cart: CompleteCartItem }>(
      `/api/carts/${cartId}/items`,
      payload,
    );
    return response.cart;
  };

  updateCartItem = async (
    cartId: string, 
    itemId: string, 
    payload: UpdateCompleteCartItemDTO,
  ) => {
    const response = await httpClient.put<{ cart: CompleteCart }>(
      `/api/carts/${cartId}/items/${itemId}`, 
      payload,
    );
    return response.cart;
  };

  updateCart = async (cartId: string, payload: UpdateCompleteCartDTO) => {
    const response = await httpClient.put<{ cart: CompleteCart }>(
      `/api/carts/${cartId}`,
      payload,
    );
    return response.cart;
  };

  deleteCart = async (cartId: string) => {
    const response = await httpClient.delete<{ success: boolean }>(
      `/api/carts/${cartId}`,
    );
    return response;
  };
}

const cartService = new CartService();

export default cartService;
export const { getCart, saveCart, updateCart, deleteCart } = cartService;

import { z } from "zod";
import {
  IceLevelSchema,
  SugarLevelSchema,
} from "@/modules/sales/orders/order.model";

// --- CART ITEM TOPPINGS ---
export const CartItemToppingSchema = z.object({
  cartItemId: z.uuidv7(),
  toppingId: z.uuidv7(),
  quantity: z.number().int().positive().default(1),
});

export const CompleteCartItemToppingSchema = CartItemToppingSchema.omit({
  cartItemId: true,
  toppingId: true,
}).extend({
  id: z.uuidv7(),
});

export const CreateCartItemToppingSchema = CartItemToppingSchema;

export const UpdateCartItemToppingSchema =
  CompleteCartItemToppingSchema.partial();

export type CartItemTopping = z.infer<typeof CartItemToppingSchema>;
export type CompleteCartItemTopping = z.infer<
  typeof CompleteCartItemToppingSchema
>;
export type CreateCartItemToppingDTO = z.input<
  typeof CreateCartItemToppingSchema
>;

// --- CART ITEMS ---
export const CartItemSchema = z.object({
  id: z.uuidv7(),
  cartId: z.uuidv7(),
  drinkVariantId: z.uuidv7(),
  quantity: z.number().int().positive().default(1),
  sugarLevel: SugarLevelSchema.nullish(),
  iceLevel: IceLevelSchema.nullish(),
});

export const CompleteCartItemSchema = CartItemSchema.extend({
  toppings: z.array(CompleteCartItemToppingSchema).default([]),
});

export const CreateCartItemSchema = CartItemSchema.omit({
  id: true,
  cartId: true,
});

export const CreateCompleteCartItemSchema = CreateCartItemSchema.extend({
  toppings: z
    .array(
      CartItemToppingSchema.omit({ cartItemId: true, toppingId: true }).extend({
        id: z.uuidv7(),
      }),
    )
    .default([]),
});

export const UpdateCompleteCartItemSchema = CompleteCartItemSchema.extend({
  toppings: z.array(UpdateCartItemToppingSchema).default([]),
});

export type CartItem = z.infer<typeof CartItemSchema>;
export type CompleteCartItem = z.infer<typeof CompleteCartItemSchema>;
export type CreateCartItemDTO = z.input<typeof CreateCartItemSchema>;
export type CreateCompleteCartItemDTO = z.input<
  typeof CreateCompleteCartItemSchema
>;
export type UpdateCompleteCartItemDTO = z.input<
  typeof UpdateCompleteCartItemSchema
>;

// --- CARTS ---
export const CartSchema = z.object({
  id: z.uuidv7(),
  customerId: z.uuidv7(),
  createdAt: z.coerce.date().default(() => new Date()),
  updatedAt: z.coerce.date().default(() => new Date()),
});

export const CompleteCartSchema = CartSchema.extend({
  items: z.array(CompleteCartItemSchema).default([]),
});

export const CreateCartSchema = CartSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const CreateCompleteCartSchema = CreateCartSchema.extend({
  items: z.array(CreateCompleteCartItemSchema).default([]),
});

export const UpdateCompleteCartSchema = CompleteCartSchema.extend({
  items: z.array(UpdateCompleteCartItemSchema).default([]),
});

export type Cart = z.infer<typeof CartSchema>;
export type CompleteCart = z.infer<typeof CompleteCartSchema>;
export type CreateCartDTO = z.input<typeof CreateCartSchema>;
export type CreateCompleteCartDTO = z.input<typeof CreateCompleteCartSchema>;
export type UpdateCompleteCartDTO = z.input<typeof UpdateCompleteCartSchema>;

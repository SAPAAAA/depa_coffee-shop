import { z } from "zod";

export const OrderStatusSchema = z.enum([
  "pending",
  "processing",
  "completed",
  "cancelled",
]);
export const PaymentMethodSchema = z.enum([
  "cash",
  "credit_card",
  "mobile_payment",
]);
export const DeliveryMethodSchema = z.enum(["pickup", "delivery"]);
export const SugarLevelSchema = z.enum(["0%", "25%", "50%", "75%", "100%"]);
export const IceLevelSchema = z.enum([
  "no_ice",
  "less_ice",
  "normal_ice",
  "extra_ice",
]);

export type OrderStatus = z.infer<typeof OrderStatusSchema>;
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;
export type DeliveryMethod = z.infer<typeof DeliveryMethodSchema>;
export type SugarLevel = z.infer<typeof SugarLevelSchema>;
export type IceLevel = z.infer<typeof IceLevelSchema>;

export const OrderItemToppingSchema = z.object({
  orderItemId: z.uuidv7(),
  toppingId: z.uuidv7(),
});
export const CreateOrderItemToppingSchema = OrderItemToppingSchema;
export type OrderItemTopping = z.infer<typeof OrderItemToppingSchema>;
export type CreateOrderItemToppingDTO = z.input<typeof CreateOrderItemToppingSchema>;

export const OrderItemSchema = z.object({
  id: z.uuidv7(),
  orderId: z.uuidv7(),
  drinkVariantId: z.uuidv7(),
  quantity: z.number().int().positive(),
  sugarLevel: SugarLevelSchema.default("100%"),
  iceLevel: IceLevelSchema.default("normal_ice"),
  calculatedPrice: z.coerce.number().nonnegative(),
});
export const CompleteOrderItemSchema = OrderItemSchema.extend({
  toppings: z.array(OrderItemToppingSchema).default([]),
});
export const CreateOrderItemSchema = OrderItemSchema.omit({ id: true, orderId: true });
export const CreateCompleteOrderItemSchema = CreateOrderItemSchema.extend({
  toppings: z.array(OrderItemToppingSchema.omit({ orderItemId: true })).default([]),
});
export type OrderItem = z.infer<typeof OrderItemSchema>;
export type CompleteOrderItem = z.infer<typeof CompleteOrderItemSchema>;
export type CreateOrderItemDTO = z.input<typeof CreateOrderItemSchema>;
export type CreateCompleteOrderItemDTO = z.input<typeof CreateCompleteOrderItemSchema>;

export const OrderSchema = z.object({
  id: z.uuidv7(),
  customerId: z.uuidv7(),
  orderDate: z.coerce.date().default(() => new Date()),
  status: OrderStatusSchema.default("pending"),
  totalAmount: z.coerce.number().nonnegative().default(0),
  paymentMethod: PaymentMethodSchema.default("cash"),
  deliveryMethod: DeliveryMethodSchema.default("pickup"),
  shippingFee: z.coerce.number().nonnegative().default(0),
  deliveryAddress: z.string().nullish().default(null),
});
export const CompleteOrderSchema = OrderSchema.extend({
  items: z.array(CompleteOrderItemSchema).default([]),
});
export const CreateOrderSchema = OrderSchema.omit({
  id: true,
  orderDate: true,
});
export const CreateCompleteOrderSchema = CreateOrderSchema.extend({
  items: z.array(
    CreateCompleteOrderItemSchema, // No need to omit orderId here since it's not part of the Create schema
  ).default([]),
});
export type Order = z.infer<typeof OrderSchema>;
export type CompleteOrder = z.infer<typeof CompleteOrderSchema>;
export type CreateOrderDTO = z.input<typeof CreateOrderSchema>;
export type CreateCompleteOrderDTO = z.input<typeof CreateCompleteOrderSchema>;

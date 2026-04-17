import type { DrinkVariant } from "@/modules/catalog/variants/variant.model";
import {
  CreateCompleteOrderSchema,
  CreateCompleteOrderItemSchema,
  type CreateCompleteOrderDTO,
  type CreateCompleteOrderItemDTO,
  type IceLevel,
  type SugarLevel,
  type DeliveryMethod,
  type PaymentMethod,
} from "./order.model";
import type { Topping } from "@/modules/catalog/toppings/topping.model";
import { BadRequestError } from "@/modules/shared/utils/errors";

export interface OrderItemBuilder {
  setVariant(drinkVariant: DrinkVariant): this;
  setIceLevel(iceLevel: IceLevel): this;
  setSugarLevel(sugarLevel: SugarLevel): this;
  addToppings(toppings: Array<{ topping: Topping; quantity: number }>): this;
  setQuantity(quantity: number): this;
  return(): CreateCompleteOrderItemDTO;
  reset(): this;
}

export class OrderItemBuilderImpl implements OrderItemBuilder {
  private readonly item: Partial<CreateCompleteOrderItemDTO> = {};
  private variantPrice: number = 0;
  private toppingsPrice: number = 0;

  constructor() {
    this.item = {
      quantity: 1,
      iceLevel: "normal_ice",
      sugarLevel: "100%",
      calculatedPrice: 0,
      toppings: [],
    };
  }

  setVariant(drinkVariant: DrinkVariant) {
    this.item.drinkVariantId = drinkVariant.id;
    this.variantPrice = drinkVariant.price;
    return this;
  }

  setIceLevel(iceLevel: IceLevel) {
    this.item.iceLevel = iceLevel;
    return this;
  }

  setSugarLevel(sugarLevel: SugarLevel) {
    this.item.sugarLevel = sugarLevel;
    return this;
  }

  addToppings(toppings: Array<{ topping: Topping; quantity: number }>) {
    this.item.toppings = toppings.map((topping) => ({
      toppingId: topping.topping.id,
      quantity: topping.quantity,
    }));
    this.toppingsPrice = toppings.reduce(
      (sum, toppingWithQuantity) =>
        sum +
        toppingWithQuantity.topping.unitPrice *
          (toppingWithQuantity.quantity ?? 1),
      0,
    );
    return this;
  }

  setQuantity(quantity: number) {
    this.item.quantity = quantity;
    return this;
  }

  return(): CreateCompleteOrderItemDTO {
    if (!this.item.drinkVariantId) {
      throw new BadRequestError(
        "Failed to build order item",
        "BUILD_OBJECT_ERROR",
      );
    }
    this.item.calculatedPrice =
      (this.variantPrice + this.toppingsPrice) * (this.item.quantity ?? 1);

    const safeItem = CreateCompleteOrderItemSchema.safeParse(this.item);
    if (!safeItem.success) {
      throw new BadRequestError(
        "Failed to build order item",
        "VALIDATION_ERROR",
      );
    }
    return safeItem.data;
  }

  reset() {
    this.item.drinkVariantId = undefined;
    this.item.iceLevel = "normal_ice";
    this.item.sugarLevel = "100%";
    this.item.quantity = 1;
    this.item.calculatedPrice = 0;
    this.item.toppings = [];
    this.variantPrice = 0;
    this.toppingsPrice = 0;
    return this;
  }
}

export interface OrderBuilder {
  setCustomer(customerId: string): this;
  setPaymentMethod(paymentMethod: PaymentMethod): this;
  setDeliveryMethod(
    deliveryMethod: DeliveryMethod,
    deliveryAddress?: string,
  ): this;
  addItem(item: CreateCompleteOrderItemDTO): this;
  return(): CreateCompleteOrderDTO;
  reset(): this;
}

export class OrderBuilderImpl implements OrderBuilder {
  private readonly order: Partial<CreateCompleteOrderDTO> = {};
  private readonly taxRate: number = 0.08;

  constructor() {
    this.order = {
      status: "pending",
      paymentMethod: "cash",
      deliveryMethod: "pickup",
      shippingFee: 0,
      totalAmount: 0,
    };
  }

  setCustomer(customerId: string) {
    this.order.customerId = customerId;
    return this;
  }

  setPaymentMethod(paymentMethod: PaymentMethod) {
    this.order.paymentMethod = paymentMethod;
    return this;
  }

  setDeliveryMethod(deliveryMethod: DeliveryMethod, deliveryAddress?: string) {
    this.order.deliveryMethod = deliveryMethod;
    if (deliveryMethod === "delivery") {
      if (!deliveryAddress) {
        throw new BadRequestError(
          "Delivery address is required",
          "VALIDATION_ERROR",
        );
      }
      this.order.deliveryAddress = deliveryAddress;
      this.order.shippingFee = 15; // not a real system, so this can be hardcoded
    } else {
      this.order.deliveryAddress = null;
      this.order.shippingFee = 0;
    }
    return this;
  }

  addItem(item: CreateCompleteOrderItemDTO) {
    this.order.items = [...(this.order.items ?? []), item];
    return this;
  }

  addItems(items: CreateCompleteOrderItemDTO[]) {
    this.order.items = [...(this.order.items ?? []), ...items];
    return this;
  }

  return(): CreateCompleteOrderDTO {
    if (!this.order.customerId) {
      throw new BadRequestError(
        "Customer ID is required",
        "BUILD_OBJECT_ERROR",
      );
    }

    if (this.order.items === undefined || this.order.items.length === 0) {
      throw new BadRequestError(
        "Order must contain at least one item",
        "BUILD_OBJECT_ERROR",
      );
    }

    const itemsTotal = this.order.items.reduce((sum, item) => {
      const price = (item.calculatedPrice as number) ?? 0;
      return sum + price;
    }, 0);
    const totalAmount = (itemsTotal + ((this.order.shippingFee as number) ?? 0)) * (1 + this.taxRate);

    const safeOrder = CreateCompleteOrderSchema.safeParse({
      ...this.order,
      totalAmount,
    });

    if (!safeOrder.success) {
      throw new BadRequestError("Failed to build order", "VALIDATION_ERROR");
    }

    return safeOrder.data;
  }

  reset() {
    this.order.customerId = undefined;
    this.order.paymentMethod = "cash";
    this.order.deliveryMethod = "pickup";
    this.order.deliveryAddress = null;
    this.order.shippingFee = 0;
    this.order.totalAmount = 0;
    this.order.items = [];

    return this;
  }
}

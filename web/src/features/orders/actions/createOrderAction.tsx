import type { Route } from "./+types/createOrderAction";
import { createOrder } from "@/services/order";
import type { DeliveryMethod, PaymentMethod } from "@api-types/sales/orders/order.model";

const createOrderAction = async ({ request }: Readonly<Route.ActionArgs>) => {
  try {
    const formData = await request.formData();
    const deliveryMethod = formData.get("deliveryMethod") as string;
    const address = formData.get("address") as string | null;
    const paymentMethod = formData.get("paymentMethod") as string;

    if (!deliveryMethod || !paymentMethod) {
      throw new Error("Delivery method and payment method are required");
    }

    const order = await createOrder(
      { method: deliveryMethod as DeliveryMethod, address: address || undefined },
      paymentMethod as PaymentMethod,
    );

    return { success: true, data: { order } };
  } catch (error: any) {
    return { success: false, error: error.message || "Order creation failed" };
  }
};

export default createOrderAction;
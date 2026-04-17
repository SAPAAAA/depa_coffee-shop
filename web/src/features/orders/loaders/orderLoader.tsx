import { getOrderById } from "@/services/order";
import type { Route } from "./+types/orderLoader";

const clientLoader = async ({ params }: Readonly<Route.LoaderArgs>) => {
  const { orderId } = params;
  if (!orderId) {
    throw new Error("Order ID is required");
  }

  const order = await getOrderById(orderId);
  return { data: { order } };
};

export default clientLoader;

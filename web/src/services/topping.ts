import { httpClient } from "@/utils/httpClient";
import type { Topping } from "@api-types/catalog/toppings/topping.model";

class ToppingService {
  getToppingById = async (toppingId: string): Promise<Topping> => {
    const response = await httpClient.get<{ topping: Topping }>(
      `/api/toppings/${toppingId}`,
    );
    return response.topping;
  };
}

const toppingsService = new ToppingService();
export default toppingsService;
export const { getToppingById } = toppingsService;
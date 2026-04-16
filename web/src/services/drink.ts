import type { Drink } from "@api-types/catalog/drinks/drink.model";
import type { DrinkCategory } from "@api-types/catalog/categories/category.model";
import type { DrinkVariant } from "@api-types/catalog/variants/variant.model";
import { httpClient } from "@/utils/httpClient";

export interface DrinkCompleteInfo extends Omit<Drink, "categoryId"> {
  category: DrinkCategory;
  variants: DrinkVariant[];
}

class DrinkService {
  getDrinkCompleteInfo = async (drinkId: string): Promise<DrinkCompleteInfo> => {
    const response = await httpClient.get<{ drink: DrinkCompleteInfo }>(`/api/drinks/${drinkId}/complete`);
    return response.drink;
  }
}

const drinkService = new DrinkService();

export const { getDrinkCompleteInfo } = drinkService;
export default drinkService;
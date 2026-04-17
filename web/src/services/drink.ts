import type { Drink } from "@api-types/catalog/drinks/drink.model";
import type { DrinkCategory } from "@api-types/catalog/categories/category.model";
import type { DrinkVariant } from "@api-types/catalog/variants/variant.model";
import { httpClient } from "@/utils/httpClient";

export interface DrinkCompleteInfo extends Omit<Drink, "categoryId"> {
  category: DrinkCategory;
  variants: DrinkVariant[];
}

class DrinkService {
  getDrinkCompleteInfo = async (
    drinkId: string,
  ): Promise<DrinkCompleteInfo> => {
    const response = await httpClient.get<{ drink: DrinkCompleteInfo }>(
      `/api/drinks/${drinkId}/complete`,
    );
    return response.drink;
  };

  getDrinkVariantById = async (variantId: string): Promise<DrinkVariant> => {
    const response = await httpClient.get<{ drinkVariant: DrinkVariant }>(
      `/api/variants/${variantId}`,
    );
    return response.drinkVariant;
  };

  getDrinkById = async (drinkId: string): Promise<Drink> => {
    const response = await httpClient.get<{ drink: Drink }>(
      `/api/drinks/${drinkId}`,
    );
    return response.drink;
  };
}

const drinkService = new DrinkService();

export const { getDrinkCompleteInfo, getDrinkVariantById, getDrinkById } =
  drinkService;
export default drinkService;

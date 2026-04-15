import { httpClient } from "@/utils/httpClient";
import type { DrinkCategory } from "@api-types/catalog/categories/category.model";
import type { MenuDrink } from "@api-types/catalog/drinks/drink.model";

interface Menu {
  categories: (DrinkCategory & {
    drinks: MenuDrink[];
  })[];
}

class MenuService {
  getMenu = async () => {
    const response = await httpClient.get<{ menu: Menu }>("/api/menu");
    return response.menu;
  };
}

const menuService = new MenuService();

export default menuService;
export const { getMenu } = menuService;

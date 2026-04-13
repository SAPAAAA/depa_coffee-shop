import type { DrinkRepository } from "@/modules/catalog/drinks/drink.repository";
import type { CategoryRepository } from "./category.repository";
import categoryRepository from "./category.repository";
import drinkRepository from "@/modules/catalog/drinks/drink.repository";
import type { Drink } from "../drinks/drink.model";

class DrinkCategoryService {
  private readonly categoryRepository: CategoryRepository;
  private readonly drinkRepository: DrinkRepository;

  constructor(
    categoryRepository: CategoryRepository,
    drinkRepository: DrinkRepository,
  ) {
    this.categoryRepository = categoryRepository;
    this.drinkRepository = drinkRepository;
  }

  getAllCategories = async () => {
    return await this.categoryRepository.getAll();
  };

  getDrinksByCategoryId = async (id: string) => {
    const category = await this.categoryRepository.getById(id);
    if (!category) {
      throw new Error("Category not found");
    }
    return category;
  };

  getCategoriesWithDrinks = async () => {
    const categoriesWithDrinks = await Promise.all([
      this.categoryRepository.getAll(),
      this.drinkRepository.getAllDrinks(),
    ]).then(([categories, drinks]) => {
      const drinksByCatId = drinks.reduce(
        (acc: Record<string, Drink[]>, drink) => {
          const catId = drink.categoryId;

          if (!acc[catId]) {
            acc[catId] = [];
          }
          acc[catId].push(drink);

          return acc;
        },
        {},
      );

      return categories.map((cat) => {
        return {
          ...cat,
          drinks: drinksByCatId[cat.id] ?? [],
        };
      });
    });
    
    return categoriesWithDrinks;
  };
}

export type { DrinkCategoryService };
export default new DrinkCategoryService(categoryRepository, drinkRepository);

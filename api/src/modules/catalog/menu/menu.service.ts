import type { DrinkCategoryRepository } from '@/modules/catalog/categories/category.repository';
import type { DrinkRepository } from '@/modules/catalog/drinks/drink.repository';
import drinkRepository from '@/modules/catalog/drinks/drink.repository';
import drinkCategoryRepository from '@/modules/catalog/categories/category.repository';

class MenuService {
  private readonly drinkRepository: DrinkRepository;
  private readonly drinkCategoryRepository: DrinkCategoryRepository;

  constructor(drinkRepository: DrinkRepository, drinkCategoryRepository: DrinkCategoryRepository) {
    this.drinkRepository = drinkRepository;
    this.drinkCategoryRepository = drinkCategoryRepository;
  }

  getMenu = async () => {
    const drinks = await this.drinkRepository.getAllDrinksBaseInfo();
    const categories = await this.drinkCategoryRepository.getAll();


    const categorizedDrinks = categories.map(category => ({
      ...category,
      drinks: drinks.filter(drink => drink.categoryId === category.id)
    }));

    return {
      categories: categorizedDrinks
    }
  }
}

export type { MenuService };
export default new MenuService(drinkRepository, drinkCategoryRepository);
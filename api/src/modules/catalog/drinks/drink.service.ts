import type { DrinkRepository } from './drink.repository';
import { CreateDrinkSchema, UpdateDrinkSchema, type CreateDrinkDTO, type UpdateDrinkDTO } from './drink.model';
import type { DrinkCategoryRepository } from '@/modules/catalog/categories/category.repository';
import type { DrinkVariantRepository } from '../variants/variant.repository';
import drinkRepository from './drink.repository';
import drinkCategoryRepository from '@/modules/catalog/categories/category.repository';
import drinkVariantRepository from '@/modules/catalog/variants/variant.repository';
import { BadRequestError } from '@/modules/shared/utils/errors';

class DrinkService {
  private readonly drinkRepository: DrinkRepository;
  private readonly drinkCategoryRepository: DrinkCategoryRepository;
  private readonly drinkVariantRepository: DrinkVariantRepository;

  constructor(drinkRepository: DrinkRepository, drinkCategoryRepository: DrinkCategoryRepository, drinkVariantRepository: DrinkVariantRepository) {  
    this.drinkRepository = drinkRepository;
    this.drinkCategoryRepository = drinkCategoryRepository;
    this.drinkVariantRepository = drinkVariantRepository;
  }

  getAllDrinks = async () => {
    return await this.drinkRepository.getAllDrinks();
  };

  getDrink = async (id: string) => {
    return await this.drinkRepository.getDrinkById(id);
  };

  getDrinkCompleteInfo = async (id: string) => {
    const drink = await this.drinkRepository.getDrinkById(id);
    if (!drink) {
      return null;
    }
    const category = await this.drinkCategoryRepository.getById(drink.categoryId);
    const { categoryId, ...drinkWithoutCategoryId } = drink;
    const variants = await this.drinkVariantRepository.getByDrinkId(id);

    return {
      ...drinkWithoutCategoryId,
      category,
      variants,
    };
  };

  createDrink = async (data: CreateDrinkDTO) => {
    const safeInput = CreateDrinkSchema.safeParse(data);
    if (!safeInput.success) {
      throw new BadRequestError("Failed to create drink", "VALIDATION_ERROR");
    }
    return await this.drinkRepository.createDrink(safeInput.data);
  };

  updateDrink = async (id: string, data: UpdateDrinkDTO) => {
    const safeInput = UpdateDrinkSchema.safeParse(data);
    if (!safeInput.success) {
      throw new BadRequestError("Failed to update drink", "VALIDATION_ERROR");
    }
    const updatedDrink = await this.drinkRepository.updateDrink(id, safeInput.data);
    if (!updatedDrink) {
      throw new Error("Drink not found");
    }
    return updatedDrink;
  };

  deleteDrink = async (id: string) => {
    await this.drinkRepository.deleteDrink(id);
  };
}

export type { DrinkService };
export default new DrinkService(drinkRepository, drinkCategoryRepository, drinkVariantRepository);
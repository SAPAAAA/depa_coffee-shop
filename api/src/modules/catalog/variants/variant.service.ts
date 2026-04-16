import type { DrinkVariantRepository } from "./variant.repository";
import drinkVariantRepository from "./variant.repository";

class DrinkVariantService {
  private readonly drinkVariantRepository: DrinkVariantRepository;

  constructor(drinkVariantRepository: DrinkVariantRepository) {
    this.drinkVariantRepository = drinkVariantRepository;
  }

  getDrinkVariant = async (id: string) => {
    return await this.drinkVariantRepository.getById(id);
  }

  getDrinkVariantsByDrinkId = async (drinkId: string) => {
    return await this.drinkVariantRepository.getByDrinkId(drinkId);
  }
}

export default new DrinkVariantService(drinkVariantRepository);
export type { DrinkVariantService };
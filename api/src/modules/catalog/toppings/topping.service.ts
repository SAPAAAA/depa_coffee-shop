import type { ToppingRepository } from "./topping.repository";
import type { CreateToppingDTO, UpdateToppingDTO } from "./topping.model";
import toppingRepository from "./topping.repository";

class ToppingService {
  private readonly toppingRepository: ToppingRepository;
  
  constructor(toppingRepository: ToppingRepository) {
    this.toppingRepository = toppingRepository;
  }

  getAllToppings = async () => {
    return await this.toppingRepository.getAllToppings();
  };

  getToppingById = async (id: string) => {
    return await this.toppingRepository.getToppingById(id);
  };

  createTopping = async (data: CreateToppingDTO) => {
    return await this.toppingRepository.createTopping(data);
  };

  updateTopping = async (id: string, data: UpdateToppingDTO) => {
    const updatedTopping = await this.toppingRepository.updateTopping(id, data);
    if (!updatedTopping) {
      throw new Error("Topping not found");
    }
    return updatedTopping;
  };

  deleteTopping = async (id: string) => {
    await this.toppingRepository.deleteTopping(id);
  };
}

export type { ToppingService };
export default new ToppingService(toppingRepository);
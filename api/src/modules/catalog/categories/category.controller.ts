import asyncHandler from "@/modules/shared/utils/asyncHandler";
import type { DrinkCategoryService } from "./category.service";
import drinkCategoryService from "./category.service";
import type { Request, Response } from "express";

class DrinkCategoryController {
  private readonly drinkCategoryService: DrinkCategoryService;

  constructor(drinkCategoryService: DrinkCategoryService) {
    this.drinkCategoryService = drinkCategoryService;
  }

  getAllCategories = asyncHandler(async (_req: Request, res: Response) => {
    const categories = await this.drinkCategoryService.getAllCategories();
    return res.status(200).json({ success: true, data: { categories } });
  });

  getCategoriesWithDrinks = asyncHandler(async (_req: Request, res: Response) => {
    const categoriesWithDrinks = await this.drinkCategoryService.getCategoriesWithDrinks();
    return res.status(200).json({ success: true, data: { categories: categoriesWithDrinks } });
  });
}

export type { DrinkCategoryController };
export default new DrinkCategoryController(drinkCategoryService);

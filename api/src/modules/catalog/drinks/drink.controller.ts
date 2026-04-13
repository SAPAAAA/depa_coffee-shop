import asyncHandler from "@/modules/shared/utils/asyncHandler";
import type { Request, Response } from "express";
import type { DrinkService } from "./drink.service";
import drinkService from "./drink.service";
import { BadRequestError, NotFoundError } from "@/modules/shared/utils/errors";

class DrinkController {
  private readonly drinkService: DrinkService;

  constructor(drinkService: DrinkService) {
    this.drinkService = drinkService;
  }

  getAllDrinks = asyncHandler(async (_req: Request, res: Response) => {
    const drinks = await this.drinkService.getAllDrinks();
    return res.status(200).json({ success: true, data: { drinks } });
  });

  getDrinkCompleteInfo = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      throw new BadRequestError("Failed to get drink info", "INVALID_ID");
    }

    const drink = await this.drinkService.getDrinkCompleteInfo(id);

    if (!drink) {
      throw new NotFoundError("Failed to get drink info", "OBJECT_NOT_FOUND");
    }

    return res.status(200).json({ success: true, data: { drink } });
  });
}

export type { DrinkController };
export default new DrinkController(drinkService);

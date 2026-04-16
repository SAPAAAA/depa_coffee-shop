import type { Request, Response } from "express";
import type { DrinkVariantService } from "./variant.service";
import { BadRequestError, NotFoundError } from "@/modules/shared/utils/errors";
import drinkVariantService from "./variant.service";

class DrinkVariantController {
  private readonly drinkVariantService: DrinkVariantService;

  constructor(drinkVariantService: DrinkVariantService) {
    this.drinkVariantService = drinkVariantService;
  }

  getDrinkVariant = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      throw new BadRequestError(
        "Failed to get drink variant info",
        "INVALID_ID",
      );
    }

    const drinkVariant = await this.drinkVariantService.getDrinkVariant(id);

    if (!drinkVariant) {
      throw new NotFoundError(
        "Failed to get drink variant info",
        "OBJECT_NOT_FOUND",
      );
    }

    return res.status(200).json({ success: true, data: { drinkVariant } });
  };

  getDrinkVariantsByDrinkId = async (req: Request, res: Response) => {
    const { drinkId } = req.params;

    if (!drinkId || Array.isArray(drinkId)) {
      throw new BadRequestError(
        "Failed to get drink variants info",
        "INVALID_DRINK_ID",
      );
    }

    const drinkVariants =
      await this.drinkVariantService.getDrinkVariantsByDrinkId(drinkId);

    return res.status(200).json({ success: true, data: { drinkVariants } });
  };
}

export type { DrinkVariantController };
export default new DrinkVariantController(drinkVariantService);

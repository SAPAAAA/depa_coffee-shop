import type { Request, Response } from "express";
import type { ToppingService } from "./topping.service";
import toppingService from "./topping.service";
import asyncHandler from "@/modules/shared/utils/asyncHandler";
import { BadRequestError, NotFoundError } from "@/modules/shared/utils/errors";

class ToppingController {
  private readonly toppingService: ToppingService;
  
  constructor(toppingService: ToppingService) {
    this.toppingService = toppingService;
  }

  getAllToppings = asyncHandler(async (_req: Request, res: Response) => {
    const toppings = await this.toppingService.getAllToppings();
    return res.status(200).json({ success: true, data: { toppings } });
  });

  getToppingById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      throw new BadRequestError("Failed to get topping info", "INVALID_ID");
    }

    const topping = await this.toppingService.getToppingById(id);
    if (!topping) {
      throw new NotFoundError("Failed to get topping info", "OBJECT_NOT_FOUND");
    }
    return res.status(200).json({ success: true, data: { topping } });
  });
}

export type { ToppingController };
export default new ToppingController(toppingService);
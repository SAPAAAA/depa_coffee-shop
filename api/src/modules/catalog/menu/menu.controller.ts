import type { Request, Response } from "express";
import asyncHandler from "@/modules/shared/utils/asyncHandler";
import type { MenuService } from "./menu.service";
import menuService from "./menu.service";

class MenuController {
  private readonly menuService: MenuService;

  constructor(menuService: MenuService) {
    this.menuService = menuService;
  }

  getMenu = asyncHandler(async (_req: Request, res: Response) => {
    const menu = await this.menuService.getMenu();
    return res.status(200).json({ success: true, data: { menu } });
  });
}

export type { MenuController };
export default new MenuController(menuService);
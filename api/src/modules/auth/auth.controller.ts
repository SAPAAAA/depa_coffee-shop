import asyncHandler from "@/modules/shared/utils/asyncHandler";
import type { AuthService } from "./auth.service";
import type { Request, Response } from "express";
import authService from "@/modules/auth/auth.service";

class AuthController {
  private readonly authService: AuthService;
  
  constructor(authService: AuthService) {
    this.authService = authService;
  }

  login = asyncHandler(async (req: Request, res: Response) => {
    const { username, password, role} = req.body;
    const { user, tokens } = await this.authService.login(username, password, role);

    res.cookie("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({ success: true, data: { user } });
  });

  refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken =
      req.cookies?.refreshToken || req.headers.authorization?.split(" ")[1];

    if (!refreshToken) {
      return res.status(401).json({ success: false, message: "No refresh token provided" });
    }

    const tokens = await this.authService.refreshTokens(refreshToken);

    res.cookie("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({ success: true });
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken =
      req.cookies?.refreshToken || req.headers.authorization?.split(" ")[1];

    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.status(200).json({ success: true });
  });
}

export type { AuthController };
export default new AuthController(authService);
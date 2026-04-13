import type { NextFunction, Request, Response } from "express";
import { ForbiddenError, UnauthorizedError } from "../utils/errors";
import authService from "@/modules/auth/auth.service";

export const authMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const token =
    req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new UnauthorizedError("No token provided", "NO_TOKEN");
  }

  try {
    const decoded = authService.verifyToken(token, "access");
    req.user = { id: decoded.userId, role: decoded.role };
    next();
  } catch {
    throw new UnauthorizedError("Invalid token", "INVALID_TOKEN");
  }
};

export const checkRole = (allowedRoles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new UnauthorizedError("No user information found", "NO_USER_INFO");
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ForbiddenError(
        "You do not have permission to access this resource",
        "FORBIDDEN",
      );
    }

    next();
  };
};

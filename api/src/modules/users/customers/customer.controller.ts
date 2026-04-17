import type { AuthService } from "@/modules/auth/auth.service";
import type { CustomerService } from "./customer.service";
import authService from "@/modules/auth/auth.service";
import customerService from "@/modules/users/customers/customer.service";
import {
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "@/modules/shared/utils/errors";
import type { Request, Response } from "express";
import { CustomerResponseSchema } from "./customer.model";

class CustomerController {
  private readonly authService: AuthService;
  private readonly customerService: CustomerService;

  constructor(authService: AuthService, customerService: CustomerService) {
    this.authService = authService;
    this.customerService = customerService;
  }

  getProfile = async (req: Request, res: Response) => {
    if (!req.user) {
      throw new UnauthorizedError("User is not authenticated", "NO_USER");
    }
    const customerId = req.user.id;
    const customer = await this.customerService.getById(customerId);

    if (!customer) {
      throw new NotFoundError("Customer not found", "OBJECT_NOT_FOUND");
    }

    if (customerId !== customer.id) {
      throw new ForbiddenError(
        "You do not have permission to access this resource",
        "FORBIDDEN",
      );
    }

    res.status(200).json({
      success: true,
      data: {
        user: { ...CustomerResponseSchema.parse(customer), role: "customer" },
      },
    });
  };

  updateProfile = async (req: Request, res: Response) => {
    if (!req.user) {
      throw new UnauthorizedError("User is not authenticated", "NO_USER");
    }

    const customerId = req.user.id;
    const updateData = req.body;

    const updatedCustomer = await this.customerService.update(
      customerId,
      updateData,
    );

    if (!updatedCustomer) {
      throw new NotFoundError("Customer not found", "OBJECT_NOT_FOUND");
    }

    if (customerId !== updatedCustomer.id) {
      throw new ForbiddenError(
        "You do not have permission to access this resource",
        "FORBIDDEN",
      );
    }

    res.status(200).json({
      success: true,
      data: { user: CustomerResponseSchema.parse(updatedCustomer) },
    });
  };
}

export type { CustomerController };
export default new CustomerController(authService, customerService);

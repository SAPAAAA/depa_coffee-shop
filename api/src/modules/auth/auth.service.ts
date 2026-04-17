import jwt, { type SignOptions } from "jsonwebtoken";
import argon2 from "argon2";
import config from "@/core/config/env";
import {
  NotFoundError,
  UnauthorizedError,
} from "@/modules/shared/utils/errors";
import type { CustomerRepository } from "@/modules/users/customers/customer.repository";
import type { StaffRepository } from "@/modules/users/staff/staff.repository";
import customerRepository from "@/modules/users/customers/customer.repository";
import staffRepository from "@/modules/users/staff/staff.repository";
import { CustomerResponseSchema } from "../users/customers/customer.model";

class AuthService {
  private readonly customerRepository: CustomerRepository;
  private readonly staffRepository: StaffRepository

  constructor(
    customerRepository: CustomerRepository,
    staffRepository: StaffRepository,
  ) {
    this.customerRepository = customerRepository;
    this.staffRepository = staffRepository;
  }

  generateTokens = async (payload: { userId: string; role: string }) => {
    const { userId, role } = payload;

    const accessOptions: SignOptions = {
      expiresIn: config.jwt.secrets.access.expireIn,
    };

    const refreshOptions: SignOptions = {
      expiresIn: config.jwt.secrets.refresh.expireIn,
    };

    const accessToken = jwt.sign(
      payload,
      config.jwt.secrets.access.secret,
      accessOptions,
    );
    const refreshToken = jwt.sign(
      { userId, role },
      config.jwt.secrets.refresh.secret,
      refreshOptions,
    );

    return { accessToken, refreshToken };
  };

  verifyToken = (token: string, type: "access" | "refresh") => {
    const secret =
      type === "access"
        ? config.jwt.secrets.access.secret
        : config.jwt.secrets.refresh.secret;
    const decoded = jwt.verify(token, secret);
    return decoded as { userId: string; role: string };
  };

  refreshTokens = async (refreshToken: string) => {
    try {
      const decoded = this.verifyToken(refreshToken, "refresh");
      const { userId, role } = decoded;

      const { accessToken, refreshToken: newRefreshToken } =
        await this.generateTokens({ userId, role });
      return { accessToken, refreshToken: newRefreshToken };
    } catch {
      throw new UnauthorizedError("Invalid refresh token", "INVALID_TOKEN");
    }
  };

  login = async (username: string, password: string, role: string) => {
    let user;

    if (role === "customer") {
      user = await this.customerRepository.getByUsername(username);
    } else if (role === "staff") {
      user = await this.staffRepository.getByUsername(username);
    } else {
      throw new NotFoundError(
        "Username or password is incorrect",
        "OBJECT_NOT_FOUND",
      );
    }

    if (!user) {
      throw new NotFoundError(
        "Username or password is incorrect",
        "OBJECT_NOT_FOUND",
      );
    }

    const passwordValid = await argon2.verify(user.password, password);
    if (!passwordValid) {
      throw new UnauthorizedError(
        "Username or password is incorrect",
        "AUTHENTICATION_FAILED",
      );
    }

    const tokens = await this.generateTokens({ userId: user.id, role });
    
    const userResponse = role === "customer" 
      ? CustomerResponseSchema.parse(user) 
      : { id: user.id, username: user.username, role }; // TODO: Remember to replace this with proper staff response schema
    
    return {
      tokens,
      user: userResponse,
    };
  };

  getMe = async (userId: string, role: string) => {
    let user;

    if (role === "customer") {
      user = await this.customerRepository.getById(userId);
    } else if (role === "staff") {
      user = await this.staffRepository.getById(userId);
    } else {
      throw new NotFoundError("User not found", "OBJECT_NOT_FOUND");
    }

    if (!user) {
      throw new NotFoundError("User not found", "OBJECT_NOT_FOUND");
    }

    const userResponse = role === "customer" 
      ? CustomerResponseSchema.parse(user) 
      : { id: user.id, username: user.username, role }; // TODO: Remember to replace this with proper staff response schema

    return userResponse;
  }

  logout = async (refreshToken: string) => {
    // TODO: Implement token blacklisting to invalidate the refresh token
    return;
  }
}

export type { AuthService };
export default new AuthService(customerRepository, staffRepository);
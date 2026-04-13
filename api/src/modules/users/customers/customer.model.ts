import { z } from "zod";

export const CustomerSchema = z.object({
  id: z.uuidv7(),
  username: z.string().min(3).max(50),
  email: z.email().nullish(),
  password: z.string(),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  phoneNumber: z.string().max(20).nullish(),
  createdAt: z.coerce.date().default(() => new Date()),
  updatedAt: z.coerce.date().default(() => new Date()),
});

export const CreateCustomerSchema = CustomerSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateCustomerSchema = CreateCustomerSchema.partial();

export const CustomerResponseSchema = CustomerSchema.omit({
  id: true,
  password: true,
  updatedAt: true,
});

export type Customer = z.infer<typeof CustomerSchema>;
export type CreateCustomerDTO = z.input<typeof CreateCustomerSchema>;
export type UpdateCustomerDTO = z.input<typeof UpdateCustomerSchema>;
export type CustomerResponseDTO = z.infer<typeof CustomerResponseSchema>;

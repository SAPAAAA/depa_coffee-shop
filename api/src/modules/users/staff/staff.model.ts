import { z } from "zod";

export const StaffRoleSchema = z.enum([
  "admin",
  "barista"
]);

export type StaffRole = z.infer<typeof StaffRoleSchema>;

export const StaffSchema = z.object({
  id: z.uuidv7(),
  username: z.string().min(3).max(50),
  email: z.email().nullish(),
  passwordHash: z.string(),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  role: StaffRoleSchema,
  isActive: z.boolean().default(true),
  createdAt: z.coerce.date().default(() => new Date()),
  updatedAt: z.coerce.date().default(() => new Date()),
});

export const CreateStaffSchema = StaffSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const UpdateStaffSchema = CreateStaffSchema.partial();

export type Staff = z.infer<typeof StaffSchema>;
export type CreateStaffDTO = z.input<typeof CreateStaffSchema>;
export type UpdateStaffDTO = z.input<typeof UpdateStaffSchema>;
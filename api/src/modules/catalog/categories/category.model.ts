import { z } from 'zod';

export const DrinkCategorySchema = z.object({
  id: z.uuidv7(),
  name: z.string().min(1).max(255),
  description: z.string().optional(),
});

export const DrinkCategoryResponseSchema = DrinkCategorySchema.omit({ id: true });
export const CreateDrinkCategorySchema = DrinkCategorySchema.omit({ id: true });
export const UpdateDrinkCategorySchema = CreateDrinkCategorySchema.partial();

export type DrinkCategory = z.infer<typeof DrinkCategorySchema>;
export type CreateDrinkCategoryDTO = z.input<typeof CreateDrinkCategorySchema>;
export type UpdateDrinkCategoryDTO = z.input<typeof UpdateDrinkCategorySchema>;
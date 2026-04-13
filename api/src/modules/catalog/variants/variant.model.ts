import { z } from 'zod';

export const DrinkVariantSchema = z.object({
  id: z.uuidv7(),
  drinkId: z.uuidv7(),
  name: z.string().min(1).max(255),
  stockQuantity: z.number().int().nonnegative().default(0),
  volumeMl: z.number().positive(),
  price: z.coerce.number().positive(),
});

export const CreateDrinkVariantSchema = DrinkVariantSchema.omit({ id: true });
export const UpdateDrinkVariantSchema = CreateDrinkVariantSchema.partial();

export type DrinkVariant = z.infer<typeof DrinkVariantSchema>;
export type CreateDrinkVariantDTO = z.input<typeof CreateDrinkVariantSchema>;
export type UpdateDrinkVariantDTO = z.input<typeof UpdateDrinkVariantSchema>;
import { z } from 'zod';
import { DrinkCategorySchema } from '@/modules/catalog/categories/category.model';
import { DrinkVariantSchema } from '@/modules/catalog/variants/variant.model';

export const DrinkSchema = z.object({
  id: z.uuidv7(),
  name: z.string(),
  description: z.string().nullish(),
  imageUrl: z.union([z.string(), z.url()]).nullish().default(null),
  categoryId: z.uuidv7(),
});

export const CompleteDrinkSchema = DrinkSchema.omit({ categoryId: true }).extend({
  category: DrinkCategorySchema,
  variants: DrinkVariantSchema.omit({ drinkId: true }).array(),
});

export const MenuDrinkSchema = DrinkSchema.extend({
  price: z.coerce.number().positive(),
  volumeMl: z.coerce.number().positive(),
});

export const CreateDrinkSchema = DrinkSchema.omit({ id: true });
export const UpdateDrinkSchema = CreateDrinkSchema.partial();

export type Drink = z.infer<typeof DrinkSchema>;
export type CompleteDrink = z.infer<typeof CompleteDrinkSchema>;
export type CreateDrinkDTO = z.infer<typeof CreateDrinkSchema>;
export type UpdateDrinkDTO = z.infer<typeof UpdateDrinkSchema>;
export type MenuDrink = z.infer<typeof MenuDrinkSchema>;
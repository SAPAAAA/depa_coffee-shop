import { z } from 'zod';

export const ToppingSchema = z.object({
  id: z.uuidv7(),
  name: z.string().min(1).max(255),
    imageUrl: z.union([z.string(), z.url()]).nullish().default(null),
  unitPrice: z.coerce.number(),
  stockQuantity: z.number(),
});

export const CreateToppingSchema = ToppingSchema.omit({ id: true });
export const UpdateToppingSchema = CreateToppingSchema.partial();

export type Topping = z.infer<typeof ToppingSchema>;
export type CreateToppingDTO = z.input<typeof CreateToppingSchema>;
export type UpdateToppingDTO = z.input<typeof UpdateToppingSchema>;
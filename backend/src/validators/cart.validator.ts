import { z } from 'zod';

export const addCartItemSchema = z.object({
  treeId: z.number().int().positive(),
  projectId: z.number().int().positive(),
  quantity: z.number().int().positive(),
});
export type AddCartItemBody = z.infer<typeof addCartItemSchema>;

export const changeItemQuantitySchema = z.object({
  quantity: z.number().int().positive(),
});
export type ChangeItemQuantityBody = z.infer<typeof changeItemQuantitySchema>;

/** Paramètre d'URL : l'identifiant d'un article du panier (entier). */
export const cartItemIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});
export type CartItemIdParam = z.infer<typeof cartItemIdParamSchema>;

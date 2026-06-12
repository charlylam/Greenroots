// ============================================================
//  validators/user.validator.ts
//  Schémas Zod pour les routes /api/users/me*.
// ============================================================
import { z } from 'zod';

/**
 * Corps de PUT /api/users/me.
 */

export const updateUserBodySchema = z
  .object({
    lastName: z.string().trim().min(1).max(80).optional(),
    firstName: z.string().trim().min(1).max(80).optional(),
    email: z.string().email('Email invalide').toLowerCase().trim().optional(),
    address: z.string().trim().min(1).max(200).optional(),
    postalCode: z.string().trim().min(1).max(20).optional(),
    city: z.string().trim().min(1).max(100).optional(),
    type: z.enum(['particulier', 'entreprise', 'association']).optional(),
    siret: z
      .string()
      .trim()
      .regex(/^\d{14}$/, 'Le SIRET doit contenir 14 chiffres')
      .nullable()
      .optional(),
    companyName: z.string().trim().min(1).max(150).nullable().optional(),
    phone: z.string().trim().max(30).nullable().optional(),
  })
  // Au moins un champ doit être fourni.
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Au moins un champ doit être fourni',
  });
/** Paramètre d'URL : l'identifiant d'une commande (entier). */
export const orderIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type UpdateUserBody = z.infer<typeof updateUserBodySchema>;
export type OrderIdParam = z.infer<typeof orderIdParamSchema>;

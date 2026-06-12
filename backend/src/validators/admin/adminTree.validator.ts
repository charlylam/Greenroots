// ============================================================
//  src/validators/admin/adminTree.validator.ts
// ============================================================

import { z } from 'zod';

export const createTreeSchema = z.object({
  commonName: z.string().min(1, 'Le nom commun est requis'),
  slug: z
    .string()
    .min(1, 'Le slug est requis')
    .regex(
      /^[a-z0-9-]+$/,
      'Le slug ne peut contenir que des minuscules, chiffres et tirets'
    ),
  scientificName: z.string().min(1, 'Le nom scientifique est requis'),
  family: z.string().min(1, 'La famille est requise'),
  shortDescription: z.string().min(1, 'La description courte est requise'),
  longDescription: z.string().optional(),
  origin: z.string().optional(),
  price: z.coerce.number().positive('Le prix doit être supérieur à 0'),
  picture: z.string().min(1, "L'image est requise"),
});

export const treeProjectsSchema = z.object({
  projectIds: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((val) => {
      if (!val) return [];
      return Array.isArray(val) ? val : [val];
    }),

  // Express transforme stocks[1], stocks[2]... en array quand les clés sont
  // des entiers. On accepte les deux formes et on ignore les valeurs vides/NaN.
  stocks: z
    .union([z.record(z.string(), z.coerce.number().min(0)), z.array(z.any())])
    .optional()
    .default({})
    .transform((val) => {
      if (!val) return {};

      if (Array.isArray(val)) {
        const result: Record<string, number> = {};
        val.forEach((v, idx) => {
          const n = Number(v);
          if (v !== null && v !== undefined && v !== '' && !isNaN(n)) {
            result[String(idx)] = n;
          }
        });
        return result;
      }

      // Record : filtre aussi les NaN éventuels
      const result: Record<string, number> = {};
      for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
        const n = Number(v);
        if (!isNaN(n)) result[k] = n;
      }
      return result;
    }),
});

export const updateTreeSchema = createTreeSchema.partial();

export type CreateTreeInput = z.infer<typeof createTreeSchema>;
export type UpdateTreeInput = z.infer<typeof updateTreeSchema>;
export type TreeProjectsInput = z.infer<typeof treeProjectsSchema>;

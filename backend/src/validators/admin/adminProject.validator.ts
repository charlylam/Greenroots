// ============================================================
// src/validators/admin/adminProject.validator.ts
// ============================================================
// Ce fichier contient les schémas de validation Zod utilisés
// par l'administration pour créer et modifier les projets.
//
// Il valide :
// - les champs principaux d'un projet ;
// - les arbres associés au projet ;
// - le stock prévu pour chaque arbre dans ce projet.
// ============================================================

import { z } from 'zod';

// ============================================================
// Validation des champs principaux d'un projet
// ============================================================

export const createProjectSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  slug: z
    .string()
    .min(1, 'Le slug est requis')
    .regex(
      /^[a-z0-9-]+$/,
      'Le slug ne peut contenir que des minuscules, chiffres et tirets'
    ),
  shortDescription: z.string().min(1, 'La description courte est requise'),
  longDescription: z.string().nullable().default(null),
  localisation: z.string().min(1, 'La localisation est requise'),
  picture: z.string().min(1, "L'image est requise"),
  progress: z.coerce.number().int().min(0).max(100),
});

// ============================================================
// Validation des arbres associés à un projet
// ============================================================
// Dans le formulaire projet, Express reçoit :
// - treeIds : un id ou une liste d'id d'arbres cochés ;
// - stocks[treeId] : le stock prévu pour chaque arbre coché.
//
// Le schéma normalise treeIds pour toujours obtenir un tableau.
// Le champ stocks est normalisé pour toujours obtenir un objet :
// { "1": 50, "2": 120 }
// ============================================================

export const projectTreesSchema = z.object({
  treeIds: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((val) => {
      if (!val) return [];
      return Array.isArray(val) ? val : [val];
    }),

  stocks: z
    .union([
      z.record(z.string(), z.coerce.number().min(0)),
      z.array(z.coerce.number().min(0).nullable()),
    ])
    .optional()
    .default({})
    .transform((val) => {
      if (!val || (Array.isArray(val) && val.length === 0)) return {};

      if (Array.isArray(val)) {
        const result: Record<string, number> = {};

        val.forEach((value, index) => {
          if (value !== null && value !== undefined) {
            result[String(index)] = value;
          }
        });

        return result;
      }

      return val as Record<string, number>;
    }),
});

// ============================================================
// Validation partielle utilisée lors de la modification
// ============================================================

export const updateProjectSchema = createProjectSchema.partial();

// ============================================================
// Types TypeScript déduits des schémas Zod
// ============================================================

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type ProjectTreesInput = z.infer<typeof projectTreesSchema>;

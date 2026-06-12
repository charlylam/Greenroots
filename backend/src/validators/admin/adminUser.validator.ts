// ============================================================
//  src/validators/admin/adminUser.validator.ts
//  Validation Zod pour les actions utilisateur (admin)
// ============================================================

import { z } from 'zod';

export const deleteUserSchema = z.object({
  id: z.coerce.number().int().positive("L'id utilisateur est invalide"),
});

export type DeleteUserInput = z.infer<typeof deleteUserSchema>;

// ============================================================
//  src/types/express.d.ts
//  Extension des types Express
//
//  Ce fichier permet d'ajouter une propriété "user"
//  à l'objet Request d'Express.
//
//  Sans ce fichier, TypeScript ne connaît pas req.user
//  et affiche une erreur dans le middleware JWT.
// ============================================================

import type { UserRole } from '@prisma/client';

// "declare global" permet de modifier les types globaux
// déjà fournis par Express.
declare global {
  namespace Express {
    // Extension de l'interface Request d'Express
    interface Request {
      // Informations ajoutées après vérification du JWT.
      // Le "?" signifie que la propriété est optionnelle
      // car certaines routes sont publiques.
      user?: {
        userId: number;
        role: UserRole;
      };
    }
  }
}

export {};

import type { Request, Response, NextFunction } from 'express';

/**
 * Middleware de contrôle d'accès administrateur.
 *
 * Ce middleware doit être exécuté après le middleware
 * d'authentification JWT (`authenticateToken`).
 *
 * Il vérifie :
 * 1. Qu'un utilisateur authentifié est présent dans la requête.
 * 2. Que cet utilisateur possède le rôle "admin".
 *
 * Si l'une des conditions n'est pas remplie,
 * l'accès est refusé.
 */
export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Sécurité supplémentaire :
  // normalement authenticateToken est exécuté avant ce middleware
  // et doit avoir ajouté l'utilisateur à la requête.
  if (!req.user) {
    return res.status(401).json({
      message: 'Authentification requise',
    });
  }

  // Vérifie que l'utilisateur possède le rôle administrateur.
  // Tous les autres rôles
  // sont interdits sur les routes protégées du back-office.
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      message: 'Accès réservé aux administrateurs',
    });
  }

  // L'utilisateur est authentifié ET administrateur.
  // On autorise la suite du traitement de la requête.
  next();
};

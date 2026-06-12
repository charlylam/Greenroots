// ============================================================
//  middlewares/errorHandler.ts — gestion centralisée des erreurs
//  À monter EN DERNIER dans app.ts. Toute erreur (throw ou
//  next(err)) finit ici et est renvoyée en JSON uniforme.
//  Express 5 transmet automatiquement les erreurs async ici.
// ============================================================
import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../lib/errors.js';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  // 1. Erreur de validation Zod -> 400 avec le détail des champs.
  if (err instanceof ZodError) {
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Les données envoyées sont invalides',
        details: err.issues,
      },
    });
    return;
  }

  // 2. Erreur métier connue (NotFound, Unauthorized, etc.).
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: { code: err.code, message: err.message },
    });
    return;
  }

  // 3. Erreur inattendue -> 500. On logge le détail côté serveur,
  //    mais on ne l'expose au client qu'en dehors de la production.
  console.error('Erreur non gérée :', err);
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
    },
  });
}

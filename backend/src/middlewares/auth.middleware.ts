// ============================================================
//  middlewares/auth.middleware.ts
//  Middleware d'authentification JWT
//
//  Ce middleware protège les routes nécessitant
//  un utilisateur connecté.
//
//  Fonctionnement :
//  1. Récupère le header Authorization
//  2. Vérifie la présence du token JWT
//  3. Vérifie la validité du token
//  4. Ajoute les informations utilisateur dans req.user
//  5. Passe au middleware suivant
// ============================================================

import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../lib/errors.js';
import type { UserRole } from '@prisma/client';

// Structure attendue du payload JWT.
// Elle doit correspondre aux données signées
// dans auth.controller.ts.
type JwtPayload = {
  userId: number;
  role: UserRole;
};

export function authenticateToken(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  // Récupération du header Authorization.
  // Format attendu :
  // Authorization: Bearer <token>
  const authHeader = req.headers.authorization;

  // Récupération éventuelle du token depuis les cookies.
  // Utile pour le futur back-office EJS, où le navigateur
  // enverra automatiquement les cookies à chaque requête.
  const cookieToken = req.cookies?.token;

  if (!authHeader && !cookieToken) {
    throw new UnauthorizedError('Authorization header is missing');
  }

  let token = cookieToken;

  // Si un header Authorization est présent,
  // il reste prioritaire sur le cookie.
  if (authHeader) {
    // Découpe le header en deux parties :
    // ["Bearer", "<token>"]
    const [type, headerToken] = authHeader.split(' ');

    // Vérifie le format du header.
    if (type !== 'Bearer' || !headerToken) {
      throw new UnauthorizedError('Invalid authorization header format');
    }
    token = headerToken;
  }

  // Vérifie et décode le token JWT.
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

    // Ajoute les informations utilisateur
    // dans la requête Express.
    // Elles seront accessibles dans les contrôleurs
    // via req.user.
    req.user = decoded;

    next();
  } catch {
    throw new UnauthorizedError('Invalid or expired token');
  }
}

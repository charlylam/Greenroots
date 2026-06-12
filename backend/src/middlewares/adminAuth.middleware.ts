// ============================================================
//  src/middlewares/adminAuth.middleware.ts
//  Middleware d'authentification pour les routes admin
//
//  Différence avec auth.middleware.ts :
//  - Lit le JWT depuis req.cookies.admin_token (cookie httpOnly)
//  - Vérifie que le rôle est bien 'admin'
//  - Redirige vers /admin/login en cas d'échec (SSR)
//    au lieu de lever une erreur JSON (API)
// ============================================================
import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import type { UserRole } from '@prisma/client';
type JwtPayload = {
  userId: number;
  role: UserRole;
};
export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const token = req.cookies?.admin_token;
  // 1. Pas de cookie → retour login
  if (!token) {
    res.redirect('/admin/login?error=Session+expir%C3%A9e');
    return;
  }
  // 2. JWT_SECRET manquant → erreur serveur
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  // 3. Vérification et décodage du token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
    // 4. Vérification du rôle admin
    if (decoded.role !== 'admin') {
      res.clearCookie('admin_token');
      res.redirect('/admin/login?error=Acc%C3%A8s+refus%C3%A9');
      return;
    }
    // 5. Tout est bon → on attache l'utilisateur à la requête
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };
    next();
  } catch {
    // Token invalide ou expiré
    res.clearCookie('admin_token');
    res.redirect('/admin/login?error=Session+invalide');
  }
}

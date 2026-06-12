import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ================================================================
// MIDDLEWARE D'AUTHENTIFICATION
// ================================================================
// Ce middleware protège les routes privées en vérifiant la présence
// d'un token JWT dans les cookies avant d'autoriser l'accès.
// Note : la validité du token est vérifiée côté Express via le middleware authenticateToken.

/**
 * Middleware exécuté sur les routes configurées.
 * Vérifie que l'utilisateur est authentifié (token JWT présent).
 * @param request - La requête Next.js
 * @returns Redirection vers /login si pas de token, sinon poursuite de la requête
 */
export async function proxy(request: NextRequest) {
  // Récupère le token JWT depuis les cookies de la requête
  const token = request.cookies.get('token')?.value;

  // Si pas de token, redirige vers la page de connexion
  if (!token) {
    return NextResponse.redirect(new URL('/authentification', request.url));
  }

  // Token présent, procède à la requête
  return NextResponse.next();
}

// Configuration du middleware : appliqué seulement aux routes privées
export const config = {
  matcher: ['/espace-client/:path*', '/panier/:path*'],
};

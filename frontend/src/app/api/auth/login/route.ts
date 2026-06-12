import { apiFetch } from '@/lib/api';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// ================================================================
// ROUTE API : AUTHENTIFICATION / CONNEXION UTILISATEUR
// ================================================================
// Cette route gère l'authentification en centralisant la logique de
// connexion sécurisée avec gestion des cookies HTTP.

/**
 * Pourquoi utiliser un Route Handler Next.js ?
 * - Permet de poser des cookies HTTP-only côté serveur
 * - Impossible côté navigateur (restriction de sécurité)
 * - Protège le token JWT contre les attaques XSS
 * - Facilite la gestion sécurisée de l'authentification
 */

/**
 * Endpoint POST pour l'authentification utilisateur.
 * @param request - Requête contenant email et password en JSON
 * @returns Cookie de session + réponse JSON de statut
 */
export const POST = async (request: Request) => {
  // Récupère le payload JSON envoyé par le formulaire de login.
  const body = await request.json();

  try {
    // Appel interne vers l'API backend /api/auth/login pour obtenir un token JWT.
    const { token } = await apiFetch(`/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    // Si la réponse ne contient pas de token, on renvoie une erreur.
    if (!token) {
      return NextResponse.json({ message: 'Token manquant' }, { status: 500 });
    }

    // Récupère l'objet cookieStore pour écrire un cookie HTTP sécurisé.
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'token',
      value: token,
      httpOnly: true, // Non accessible via JavaScript (protection XSS)
      path: '/', // Disponible sur tout le site
      secure: process.env.NODE_ENV === 'production', // HTTPS only en production
      sameSite: 'strict', // Protection CSRF
      maxAge: 60 * 60 * 24, // Valable 1 jour
    });

    // Retourne une réponse JSON indiquant le succès de l'authentification.
    return NextResponse.json({ message: 'Connexion réussie' }, { status: 200 });
  } catch (error) {
    // En cas d'erreur (échec du login, backend inaccessible, etc.), on renvoie un message générique.
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Erreur de connexion',
      },
      { status: 500 }
    );
  }
};

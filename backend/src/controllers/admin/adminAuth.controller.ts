// ============================================================
//  src/controllers/admin/adminAuth.controller.ts
//  Gestion de l'authentification admin
//
//  Fonctions :
//  - getLogin  : affiche le formulaire de connexion
//  - postLogin : vérifie les credentials, pose le cookie JWT
//  - postLogout: supprime le cookie et redirige vers login
// ============================================================

import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import * as argon2 from 'argon2';
import { prisma } from '../../lib/prisma.js';

// ---- GET /admin/login ----
export async function getLogin(req: Request, res: Response): Promise<void> {
  // Affiche la page de connexion admin.
  // Si un cookie d'admin est déjà présent et valide, on évite de montrer à nouveau
  // le formulaire et on redirige directement vers le tableau de bord sécurisé.
  const token = req.cookies?.admin_token;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        role: string;
      };
      if (decoded.role === 'admin') {
        // Le JWT contient le rôle de l'utilisateur.
        // Si ce rôle est bien "admin", l'accès au back-office est autorisé.
        res.redirect('/admin/dashboard');
        return;
      }
    } catch {
      // Si le token est expiré, falsifié ou invalide, on le supprime proprement
      // et on laisse l'utilisateur accéder à la page de connexion.
      res.clearCookie('admin_token');
    }
  }

  res.render('admin/login', { query: req.query });
}

// ---- POST /admin/login ----
export async function postLogin(req: Request, res: Response): Promise<void> {
  // Récupère les identifiants envoyés par le formulaire de connexion.
  // On garde ici une vérification simple pour éviter les requêtes vides.
  const { email, password } = req.body;

  if (!email || !password) {
    // Les deux champs sont nécessaires pour continuer.
    // En cas d'absence, on redirige vers le formulaire avec un message d'erreur.
    res.redirect('/admin/login?error=Email+et+mot+de+passe+requis');
    return;
  }

  try {
    // Recherche de l'utilisateur correspondant à l'email fourni.
    // On vérifie ensuite qu'il existe bien et qu'il possède le rôle admin.
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.role !== 'admin') {
      // Un compte non existant ou non administrateur ne doit pas pouvoir se connecter.
      res.redirect('/admin/login?error=Identifiants+incorrects');
      return;
    }

    // Vérification du mot de passe avec Argon2, un algorithme de hachage adapté.
    const isPasswordValid = await argon2.verify(user.password, password);

    if (!isPasswordValid) {
      // Même si l'email existe, un mot de passe erroné bloque l'accès.
      res.redirect('/admin/login?error=Identifiants+incorrects');
      return;
    }

    // Vérification que la variable secrète JWT est bien configurée.
    // Sans elle, la génération du token ne peut pas fonctionner.
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    } // Génération du JWT

    // Génération d'un JWT pour l'admin authentifié.
    // Le token contient l'identifiant et le rôle, avec une durée de validité de 8 heures.
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    // Stockage du JWT dans un cookie HttpOnly pour sécuriser l'authentification.
    // Le cookie est envoyé uniquement par HTTP, et non accessible en JavaScript côté navigateur.
    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 8 * 60 * 60 * 1000, // 8h en ms
    });

    // Si tout est valide, on redirige vers le tableau de bord admin.
    res.redirect('/admin/dashboard');
  } catch (error) {
    // Toute erreur inattendue est journalisée et l'utilisateur est renvoyé
    // vers la page de connexion avec un message générique.
    console.error('[adminAuth] postLogin error:', error);
    res.redirect('/admin/login?error=Erreur+serveur');
  }
}

// ---- POST /admin/logout ----
export function postLogout(_req: Request, res: Response): void {
  // Supprime le cookie de session admin pour déconnecter l'utilisateur.
  // Puis on le redirige vers la page de connexion.
  res.clearCookie('admin_token');
  res.redirect('/admin/login');
}

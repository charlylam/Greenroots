// ============================================================
//  lib/errors.ts — classes d'erreurs métier
//  Chaque erreur porte un code HTTP et un code applicatif.
//  Le middleware errorHandler les transforme en réponse JSON.
// ============================================================

/** Erreur métier de base. */
export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

/** 404 — la ressource demandée n'existe pas. */
export class NotFoundError extends AppError {
  constructor(message = 'Ressource introuvable') {
    super(404, 'NOT_FOUND', message);
  }
}

/** 400 — les données envoyées sont invalides. */
export class ValidationError extends AppError {
  constructor(message = 'Données invalides') {
    super(400, 'VALIDATION_ERROR', message);
  }
}

/** 401 — authentification requise ou échouée. */
export class UnauthorizedError extends AppError {
  constructor(message = 'Authentification requise') {
    super(401, 'UNAUTHORIZED', message);
  }
}

/** 403 — utilisateur authentifié mais sans les droits nécessaires. */
export class ForbiddenError extends AppError {
  constructor(message = 'Accès refusé') {
    super(403, 'FORBIDDEN', message);
  }
}

/** 409 — conflit avec une ressource existante (ex. email déjà pris). */
export class ConflictError extends AppError {
  constructor(message = 'Conflit avec une ressource existante') {
    super(409, 'CONFLICT', message);
  }
}

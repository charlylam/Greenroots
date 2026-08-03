import rateLimit from 'express-rate-limit';

// En environnement de test, la suite automatisée dépasse largement
// le seuil pensé pour un utilisateur réel : la variable DISABLE_RATE_LIMIT
// permet de désactiver la limite uniquement dans ce contexte.
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Trop de tentatives, réessayez plus tard.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.DISABLE_RATE_LIMIT === 'true',
});

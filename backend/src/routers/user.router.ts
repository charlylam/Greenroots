import { Router } from 'express';
import { userController } from '../controllers/user.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

export const router = Router();

// Toutes les routes /users/me nécessitent un JWT valide.
router.use(authenticateToken);
// GET    /api/users/me              -> profil
// PUT    /api/users/me              -> mise à jour partielle
// DELETE /api/users/me              -> suppression du compte (RGPD)
router.get('/me', userController.me);
router.put('/me', userController.update);
router.delete('/me', userController.remove);

// GET    /api/users/me/orders       -> liste des commandes
// GET    /api/users/me/orders/:id   -> détail d'une commande
router.get('/me/orders', userController.listOrders);
router.get('/me/orders/:id', userController.getOrder);

import { Router } from 'express';
import { orderController } from '../controllers/order.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

export const router = Router();

// Toutes les routes /orders nécessitent un JWT valide.
router.use(authenticateToken);

router.post('/', orderController.create);

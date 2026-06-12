import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import * as cartController from '../controllers/cart.controller.js';

export const router = Router();

router.use(authenticateToken);

router.get('/', cartController.getActiveCart);
router.post('/items', cartController.addItemToCart);
router.patch('/items/:id', cartController.changeItemQuantity);
router.delete('/items/:id', cartController.deleteItemFromCart);
router.delete('/', cartController.deleteAllItemsFromCart);

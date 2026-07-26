// backend/src/routers/payment.router.ts
import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { createCheckoutSession } from '../controllers/payment.controller.js';

export const router = Router();

router.post('/checkout-session', authenticateToken, createCheckoutSession);

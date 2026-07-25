import { Router, raw } from 'express';
import { handleStripeWebhook } from '../controllers/stripe-webhook.controller.js';

export const router = Router();

router.post('/stripe', raw({ type: 'application/json' }), handleStripeWebhook);

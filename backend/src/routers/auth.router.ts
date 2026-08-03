import { Router } from 'express';

//Imports des controllers et middlewares
import {
  registerUser,
  loginUser,
  logoutUser,
} from '../controllers/auth.controller.js';
import { authRateLimiter } from '../middlewares/rateLimit.middleware.js';

//Instanciation du router
export const router = Router();

//Définition des routes d'authentification

router.post('/register', authRateLimiter, registerUser);

router.post('/login', authRateLimiter, loginUser);

router.post('/logout', logoutUser);

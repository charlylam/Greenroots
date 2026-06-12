import { Router } from 'express';

//Imports des controllers et middlewares
import {
  registerUser,
  loginUser,
  logoutUser,
} from '../controllers/auth.controller.js';

//Instanciation du router
export const router = Router();

//Définition des routes d'authentification

router.post('/register', registerUser);

router.post('/login', loginUser);

router.post('/logout', logoutUser);

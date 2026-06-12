import { Router } from 'express';
import * as treesController from '../controllers/trees.controller.js';

export const router = Router();

router.get('/', treesController.getAllTrees);
router.get('/:slug', treesController.getOneTree);

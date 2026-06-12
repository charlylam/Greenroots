import { Router } from 'express';

import * as projectsController from '../controllers/project.controller.js';

export const router = Router();

router.get('/', projectsController.getAllProjects);
router.get('/localisations', projectsController.getProjectsLocalisations);
router.get('/:slug', projectsController.getOneProject);
router.get('/:slug/trees', projectsController.getAllTreesByProjectSlug);

// ============================================================
// src/routers/admin.router.ts
// ============================================================

import { Router } from 'express';
import { requireAdmin } from '../middlewares/adminAuth.middleware.js';
import { uploadImage } from '../middlewares/upload.middleware.js';
import {
  getLogin,
  postLogin,
  postLogout,
} from '../controllers/admin/adminAuth.controller.js';
import {
  getDashboard,
  postCreateProject,
  postUpdateProject,
  postDeleteProject,
  postCreateTree,
  postUpdateTree,
  postDeleteTree,
  postDeleteUser,
} from '../controllers/admin/adminDashboard.controller.js';

export const adminRouter = Router();

// ---- Routes publiques ----
adminRouter.get('/login', getLogin);
adminRouter.post('/login', postLogin);

// ---- Routes protégées ----
adminRouter.post('/logout', requireAdmin, postLogout);

// Dashboard
adminRouter.get('/dashboard', requireAdmin, getDashboard);

// Projets
adminRouter.post(
  '/projects',
  requireAdmin,
  uploadImage.single('picture'),
  postCreateProject
);
adminRouter.post(
  '/projects/:id',
  requireAdmin,
  uploadImage.single('picture'),
  postUpdateProject
);
adminRouter.post('/projects/:id/delete', requireAdmin, postDeleteProject);

// Arbres
adminRouter.post(
  '/trees',
  requireAdmin,
  uploadImage.single('picture'),
  postCreateTree
);
adminRouter.post(
  '/trees/:id',
  requireAdmin,
  uploadImage.single('picture'),
  postUpdateTree
);
adminRouter.post('/trees/:id/delete', requireAdmin, postDeleteTree);

// Utilisateurs
adminRouter.post('/users/:id/delete', requireAdmin, postDeleteUser);

// Redirect /admin → /admin/login
adminRouter.get('/', (_req, res) => {
  res.redirect('/admin/login');
});

// ============================================================
// src/controllers/admin/adminDashboard.controller.ts
// ============================================================

import type { Request, Response } from 'express';
import type { ZodError } from 'zod';

import { prisma } from '../../lib/prisma.js';

type PrismaClient = typeof prisma;
type TransactionClient = Parameters<
  Parameters<PrismaClient['$transaction']>[0]
>[0];

import {
  createProjectSchema,
  updateProjectSchema,
  projectTreesSchema,
} from '../../validators/admin/adminProject.validator.js';

import {
  createTreeSchema,
  updateTreeSchema,
  treeProjectsSchema,
} from '../../validators/admin/adminTree.validator.js';

import { deleteUserSchema } from '../../validators/admin/adminUser.validator.js';

// ============================================================
// Helpers
// ============================================================

function redirectValidationError(
  res: Response,
  section: string,
  error: ZodError
): void {
  const message = encodeURIComponent(
    error.issues[0]?.message ?? 'Données invalides'
  );
  res.redirect(`/admin/dashboard?section=${section}&error=${message}`);
}

function hasPrismaCode(error: unknown, code: string): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code: string }).code === code
  );
}

function resolvePicture(req: Request): string | undefined {
  if (req.file) {
    return req.file.filename;
  }
  return req.body.picture || undefined;
}

// ============================================================
// GET /admin/dashboard
// ============================================================

export async function getDashboard(req: Request, res: Response): Promise<void> {
  try {
    const treeSearch = (req.query.treeSearch as string | undefined)?.trim();
    const treeProjectId = req.query.treeProjectId
      ? Number(req.query.treeProjectId)
      : undefined;

    const projectSearch = (
      req.query.projectSearch as string | undefined
    )?.trim();
    const projectTreeId = req.query.projectTreeId
      ? Number(req.query.projectTreeId)
      : undefined;

    const allowedProjectSortFields = [
      'name',
      'localisation',
      'progress',
      'stock',
    ] as const;

    type ProjectSortField = (typeof allowedProjectSortFields)[number];

    const rawProjectSortBy = req.query.projectSortBy as string | undefined;

    const projectSortBy: ProjectSortField = allowedProjectSortFields.includes(
      rawProjectSortBy as ProjectSortField
    )
      ? (rawProjectSortBy as ProjectSortField)
      : 'name';

    const projectSortOrder =
      req.query.projectSortOrder === 'desc' ? 'desc' : 'asc';

    const projectWhere = {
      ...(projectSearch && {
        name: { contains: projectSearch, mode: 'insensitive' as const },
      }),
      ...(projectTreeId && {
        trees: { some: { treeId: projectTreeId } },
      }),
    };

    const allowedSortFields = [
      'commonName',
      'scientificName',
      'family',
      'price',
    ] as const;
    type SortField = (typeof allowedSortFields)[number];
    const rawSortBy = req.query.treeSortBy as string | undefined;
    const treeSortBy: SortField = allowedSortFields.includes(
      rawSortBy as SortField
    )
      ? (rawSortBy as SortField)
      : 'commonName';
    const treeSortOrder = req.query.treeSortOrder === 'desc' ? 'desc' : 'asc';

    const treeWhere = {
      ...(treeSearch && {
        commonName: { contains: treeSearch, mode: 'insensitive' as const },
      }),
      ...(treeProjectId && {
        projects: { some: { projectId: treeProjectId } },
      }),
    };

    const projectOrderBy =
      projectSortBy === 'stock'
        ? { createdAt: 'desc' as const }
        : { [projectSortBy]: projectSortOrder };

    const [projects, trees, orders, users] = await Promise.all([
      prisma.project.findMany({
        where: projectWhere,
        orderBy: projectOrderBy,
        include: {
          trees: {
            include: {
              tree: {
                select: { id: true, commonName: true, slug: true },
              },
            },
          },
        },
      }),

      prisma.tree.findMany({
        where: treeWhere,
        orderBy: { [treeSortBy]: treeSortOrder },
        include: {
          projects: {
            include: {
              project: {
                select: { id: true, name: true, slug: true },
              },
            },
          },
        },
      }),

      prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
              deletedAt: true,
            },
          },
          items: true,
        },
      }),

      // On exclut les utilisateurs hard-deleted (sans commandes) — ils ne sont
      // plus en base. Les anonymisés (avec commandes) ont deletedAt non null.
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          type: true,
          role: true,
          createdAt: true,
          deletedAt: true,
        },
      }),
    ]);

    res.render('admin/dashboard', {
      projects,
      trees,
      orders,
      users,
      query: req.query,
      treeSearch: treeSearch ?? '',
      treeProjectId: treeProjectId ?? '',
      treeSortBy,
      treeSortOrder,
      projectSearch: projectSearch ?? '',
      projectTreeId: projectTreeId ?? '',
      projectSortBy,
      projectSortOrder,
      frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    });
  } catch (error) {
    console.error('[adminDashboard] getDashboard error:', error);
    res.redirect(
      '/admin/dashboard?error=Erreur+lors+du+chargement+des+donn%C3%A9es'
    );
  }
}

// ============================================================
// POST /admin/projects — Créer un projet
// ============================================================

export async function postCreateProject(
  req: Request,
  res: Response
): Promise<void> {
  const body = { ...req.body, picture: resolvePicture(req) };
  const result = createProjectSchema.safeParse(body);

  if (!result.success) {
    redirectValidationError(res, 'projects', result.error);
    return;
  }

  const treesResult = projectTreesSchema.safeParse(req.body);
  const { treeIds, stocks } = treesResult.success
    ? treesResult.data
    : { treeIds: [], stocks: {} };

  try {
    await prisma.$transaction(async (tx: TransactionClient) => {
      const project = await tx.project.create({
        data: {
          ...result.data,
          longDescription: result.data.longDescription ?? null,
        },
      });

      if (treeIds && treeIds.length > 0) {
        await tx.projectHasTree.createMany({
          data: treeIds.map((treeId) => ({
            projectId: project.id,
            treeId: Number(treeId),
            stock: stocks?.[`t${treeId}`] ?? 0,
          })),
        });
      }
    });

    res.redirect(
      '/admin/dashboard?section=projects&success=Projet+cr%C3%A9%C3%A9+avec+succ%C3%A8s'
    );
  } catch (error) {
    console.error('[adminDashboard] postCreateProject error:', error);
    if (hasPrismaCode(error, 'P2002')) {
      res.redirect(
        '/admin/dashboard?section=projects&error=Ce+slug+existe+d%C3%A9j%C3%A0'
      );
      return;
    }
    res.redirect(
      '/admin/dashboard?section=projects&error=Erreur+lors+de+la+cr%C3%A9ation'
    );
  }
}

// ============================================================
// POST /admin/projects/:id — Modifier un projet
// ============================================================

export async function postUpdateProject(
  req: Request,
  res: Response
): Promise<void> {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    res.redirect(
      '/admin/dashboard?section=projects&error=Identifiant+invalide'
    );
    return;
  }

  const body = { ...req.body, picture: resolvePicture(req) };
  const result = updateProjectSchema.safeParse(body);

  if (!result.success) {
    redirectValidationError(res, 'projects', result.error);
    return;
  }

  const treesResult = projectTreesSchema.safeParse(req.body);
  const { treeIds, stocks } = treesResult.success
    ? treesResult.data
    : { treeIds: [], stocks: {} };

  try {
    await prisma.$transaction(async (tx: TransactionClient) => {
      await tx.project.update({
        where: { id },
        data: Object.fromEntries(
          Object.entries(result.data).filter(([, value]) => value !== undefined)
        ),
      });

      await tx.projectHasTree.deleteMany({ where: { projectId: id } });

      if (treeIds && treeIds.length > 0) {
        await tx.projectHasTree.createMany({
          data: treeIds.map((treeId) => ({
            projectId: id,
            treeId: Number(treeId),
            stock: stocks?.[`t${treeId}`] ?? 0,
          })),
        });
      }
    });

    res.redirect(
      '/admin/dashboard?section=projects&success=Projet+mis+%C3%A0+jour'
    );
  } catch (error) {
    console.error('[adminDashboard] postUpdateProject error:', error);
    if (hasPrismaCode(error, 'P2025')) {
      res.redirect(
        '/admin/dashboard?section=projects&error=Projet+introuvable'
      );
      return;
    }
    if (hasPrismaCode(error, 'P2002')) {
      res.redirect(
        '/admin/dashboard?section=projects&error=Ce+slug+existe+d%C3%A9j%C3%A0'
      );
      return;
    }
    res.redirect(
      '/admin/dashboard?section=projects&error=Erreur+lors+de+la+mise+%C3%A0+jour'
    );
  }
}

// ============================================================
// POST /admin/projects/:id/delete — Supprimer un projet
// ============================================================

export async function postDeleteProject(
  req: Request,
  res: Response
): Promise<void> {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    res.redirect(
      '/admin/dashboard?section=projects&error=Identifiant+invalide'
    );
    return;
  }

  try {
    await prisma.project.delete({ where: { id } });
    res.redirect(
      '/admin/dashboard?section=projects&success=Projet+supprim%C3%A9'
    );
  } catch (error) {
    console.error('[adminDashboard] postDeleteProject error:', error);
    if (hasPrismaCode(error, 'P2025')) {
      res.redirect(
        '/admin/dashboard?section=projects&error=Projet+introuvable'
      );
      return;
    }
    res.redirect(
      '/admin/dashboard?section=projects&error=Erreur+lors+de+la+suppression'
    );
  }
}

// ============================================================
// POST /admin/trees — Créer un arbre + associations projets
// ============================================================

export async function postCreateTree(
  req: Request,
  res: Response
): Promise<void> {
  const body = { ...req.body, picture: resolvePicture(req) };
  const result = createTreeSchema.safeParse(body);

  if (!result.success) {
    redirectValidationError(res, 'trees', result.error);
    return;
  }

  const projectsResult = treeProjectsSchema.safeParse(req.body);
  const { projectIds, stocks } = projectsResult.success
    ? projectsResult.data
    : { projectIds: [], stocks: {} };

  try {
    await prisma.$transaction(async (tx: TransactionClient) => {
      const tree = await tx.tree.create({
        data: {
          ...result.data,
          longDescription: result.data.longDescription ?? null,
          origin: result.data.origin ?? null,
        },
      });

      if (projectIds && projectIds.length > 0) {
        await tx.projectHasTree.createMany({
          data: projectIds.map((projectId) => ({
            treeId: tree.id,
            projectId: Number(projectId),
            stock: stocks?.[`p${projectId}`] ?? 0,
          })),
        });
      }
    });

    res.redirect(
      '/admin/dashboard?section=trees&success=Arbre+cr%C3%A9%C3%A9+avec+succ%C3%A8s'
    );
  } catch (error) {
    console.error('[adminDashboard] postCreateTree error:', error);
    if (hasPrismaCode(error, 'P2002')) {
      res.redirect(
        '/admin/dashboard?section=trees&error=Ce+slug+existe+d%C3%A9j%C3%A0'
      );
      return;
    }
    res.redirect(
      '/admin/dashboard?section=trees&error=Erreur+lors+de+la+cr%C3%A9ation'
    );
  }
}

// ============================================================
// POST /admin/trees/:id — Modifier un arbre + associations
// ============================================================

export async function postUpdateTree(
  req: Request,
  res: Response
): Promise<void> {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    res.redirect('/admin/dashboard?section=trees&error=Identifiant+invalide');
    return;
  }

  const body = { ...req.body, picture: resolvePicture(req) };
  const result = updateTreeSchema.safeParse(body);

  if (!result.success) {
    redirectValidationError(res, 'trees', result.error);
    return;
  }

  const projectsResult = treeProjectsSchema.safeParse(req.body);
  const { projectIds, stocks } = projectsResult.success
    ? projectsResult.data
    : { projectIds: [], stocks: {} };

  try {
    await prisma.$transaction(async (tx: TransactionClient) => {
      await tx.tree.update({
        where: { id },
        data: Object.fromEntries(
          Object.entries(result.data).filter(([, value]) => value !== undefined)
        ),
      });
      await tx.projectHasTree.deleteMany({ where: { treeId: id } });

      if (projectIds && projectIds.length > 0) {
        await tx.projectHasTree.createMany({
          data: projectIds.map((projectId) => ({
            treeId: id,
            projectId: Number(projectId),
            stock: stocks?.[`p${projectId}`] ?? 0,
          })),
        });
      }
    });

    res.redirect(
      '/admin/dashboard?section=trees&success=Arbre+mis+%C3%A0+jour'
    );
  } catch (error) {
    console.error('[adminDashboard] postUpdateTree error:', error);
    if (hasPrismaCode(error, 'P2025')) {
      res.redirect('/admin/dashboard?section=trees&error=Arbre+introuvable');
      return;
    }
    if (hasPrismaCode(error, 'P2002')) {
      res.redirect(
        '/admin/dashboard?section=trees&error=Ce+slug+existe+d%C3%A9j%C3%A0'
      );
      return;
    }
    res.redirect(
      '/admin/dashboard?section=trees&error=Erreur+lors+de+la+mise+%C3%A0+jour'
    );
  }
}

// ============================================================
// POST /admin/trees/:id/delete — Supprimer un arbre
// ============================================================

export async function postDeleteTree(
  req: Request,
  res: Response
): Promise<void> {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    res.redirect('/admin/dashboard?section=trees&error=Identifiant+invalide');
    return;
  }

  try {
    const ordersCount = await prisma.orderItem.count({ where: { treeId: id } });

    if (ordersCount > 0) {
      res.redirect(
        '/admin/dashboard?section=trees&error=Impossible+de+supprimer+cet+arbre+car+il+est+utilis%C3%A9+dans+des+commandes'
      );
      return;
    }

    await prisma.$transaction(async (tx: TransactionClient) => {
      await tx.projectHasTree.deleteMany({ where: { treeId: id } });
      await tx.tree.delete({ where: { id } });
    });

    res.redirect('/admin/dashboard?section=trees&success=Arbre+supprim%C3%A9');
  } catch (error) {
    console.error('[adminDashboard] postDeleteTree error:', error);
    if (hasPrismaCode(error, 'P2025')) {
      res.redirect('/admin/dashboard?section=trees&error=Arbre+introuvable');
      return;
    }
    res.redirect(
      '/admin/dashboard?section=trees&error=Erreur+lors+de+la+suppression'
    );
  }
}

// ============================================================
// POST /admin/users/:id/delete — Suppression RGPD utilisateur
// ============================================================
// Deux cas :
//
// 1. Aucune commande → hard delete (la ligne disparaît complètement de la BDD,
//    le panier est supprimé via CASCADE, l'email est libéré → réinscription OK).
//
// 2. Commandes existantes → anonymisation RGPD :
//    - Les données personnelles sont écrasées (nom, email, adresse…).
//    - L'email devient `deleted-{id}@anonymized.local` (unique en base) ce qui
//      libère l'adresse originale → l'utilisateur peut recréer un compte.
//    - Le panier actif est supprimé (l'anonymisé ne peut plus se connecter).
//    - Les commandes sont conservées pour la traçabilité comptable.
//    - `deletedAt` est horodaté → le dashboard affiche "Inactif" + données masquées.
//
// Réponse JSON : { action: 'deleted' | 'anonymized' }
// Le JS côté EJS met à jour le DOM sans rechargement de page.
// ============================================================

export async function postDeleteUser(
  req: Request,
  res: Response
): Promise<void> {
  const result = deleteUserSchema.safeParse({ id: req.params.id });

  if (!result.success) {
    res.redirect('/admin/dashboard?section=users&error=Identifiant+invalide');
    return;
  }

  const { id } = result.data;

  try {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      res.redirect(
        '/admin/dashboard?section=users&error=Utilisateur+introuvable'
      );
      return;
    }

    if (user.role === 'admin') {
      res.redirect(
        '/admin/dashboard?section=users&error=Impossible+de+supprimer+un+administrateur'
      );
      return;
    }

    if (user.deletedAt) {
      res.redirect(
        '/admin/dashboard?section=users&error=Utilisateur+d%C3%A9j%C3%A0+d%C3%A9sactiv%C3%A9'
      );
      return;
    }

    const orderCount = await prisma.order.count({ where: { userId: id } });

    if (orderCount === 0) {
      // Cas 1 : aucune commande → suppression totale de la ligne.
      // ON DELETE CASCADE supprime aussi le panier.
      // L'email est libéré : l'utilisateur peut se réinscrire avec la même adresse.
      await prisma.user.delete({ where: { id } });
      res.json({ action: 'deleted' });
    } else {
      // Cas 2 : commandes existantes → anonymisation RGPD.
      // L'email original est remplacé par un email technique unique :
      //   deleted-{id}@anonymized.local
      // → l'adresse originale est donc libérée pour une réinscription future.
      await prisma.$transaction([
        prisma.cart.deleteMany({
          where: { userId: id, status: 'active' },
        }),
        prisma.user.update({
          where: { id },
          data: {
            email: `deleted-${id}@anonymized.local`,
            lastName: 'Anonyme',
            firstName: 'Utilisateur',
            address: '',
            postalCode: '',
            city: '',
            phone: null,
            siret: null,
            companyName: null,
            password: '',
            deletedAt: new Date(),
          },
        }),
      ]);
      res.json({ action: 'anonymized' });
    }
  } catch (error) {
    console.error('[adminDashboard] postDeleteUser error:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
}

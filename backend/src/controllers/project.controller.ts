import type { Request, Response } from 'express';
import { NotFoundError } from '../lib/errors.js';
import { prisma } from '../lib/prisma.js';
import type { Prisma } from '@prisma/client';

function computeProgress(orderedQuantity: number, requiredQuantity: number) {
  if (requiredQuantity <= 0) {
    return 0;
  }

  return Math.min(Math.round((orderedQuantity / requiredQuantity) * 100), 100);
}

export async function getAllProjects(req: Request, res: Response) {
  const page = Number(req.query.page) || 1;
  const localisation = req.query.localisation as string | undefined;
  const search = req.query.search as string | undefined;
  const sortOrder = (req.query.sortOrder as string) === 'desc' ? 'desc' : 'asc';

  const includeProgressData = {
    trees: {
      select: {
        stock: true,
      },
    },
    orderItems: {
      where: {
        order: {
          status: 'validated' as const,
        },
      },
      select: {
        quantity: true,
      },
    },
  };

  const formatProjectWithProgress = (
    project: Prisma.ProjectGetPayload<{ include: typeof includeProgressData }>
  ) => {
    const requiredQuantity = project.trees.reduce(
      (total, tree) => total + tree.stock,
      0
    );

    const orderedQuantity = project.orderItems.reduce(
      (total, item) => total + item.quantity,
      0
    );

    return {
      id: project.id,
      name: project.name,
      shortDescription: project.shortDescription,
      slug: project.slug,
      localisation: project.localisation,
      picture: project.picture,
      progress: computeProgress(orderedQuantity, requiredQuantity),
    };
  };

  if (!req.query.page) {
    const projects = await prisma.project.findMany({
      include: includeProgressData,
    });

    return res.status(200).json({
      projects: projects.map(formatProjectWithProgress),
    });
  }

  const where: Prisma.ProjectWhereInput = {
    AND: [
      localisation
        ? { localisation: { contains: localisation, mode: 'insensitive' } }
        : {},
      search ? { name: { contains: search, mode: 'insensitive' } } : {},
    ],
  };

  const limit = 6;

  const [projects, total] = await prisma.$transaction([
    prisma.project.findMany({
      where,
      orderBy: { name: sortOrder },
      take: limit,
      skip: limit * (page - 1),
      include: includeProgressData,
    }),
    prisma.project.count({ where }),
  ]);

  if (projects.length === 0 && total > 0) {
    throw new NotFoundError();
  }

  return res.status(200).json({
    projects: projects.map(formatProjectWithProgress),
    total,
    limit,
  });
}

export async function getProjectsLocalisations(req: Request, res: Response) {
  const projects = await prisma.project.findMany({
    select: { localisation: true },
    distinct: ['localisation'],
  });
  const localisations = projects.map((project) => project.localisation);
  res.status(200).json({ localisations });
}

export async function getOneProject(req: Request, res: Response) {
  const slug = req.params.slug as string;

  const project = await prisma.project.findUnique({
    where: { slug },
    include: {
      trees: {
        select: {
          stock: true,
        },
      },
      orderItems: {
        where: {
          order: {
            status: 'validated',
          },
        },
        select: {
          quantity: true,
        },
      },
    },
  });

  if (!project) {
    throw new NotFoundError();
  }

  const requiredQuantity = project.trees.reduce(
    (total, tree) => total + tree.stock,
    0
  );

  const orderedQuantity = project.orderItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  res.status(200).json({
    ...project,
    progress: computeProgress(orderedQuantity, requiredQuantity),
  });
}

export async function getAllTreesByProjectSlug(req: Request, res: Response) {
  const page = Number(req.query.page) || 1;
  const limit = 6;
  const slug = req.params.slug as string;
  const [trees, total] = await prisma.$transaction([
    prisma.projectHasTree.findMany({
      where: { project: { slug } },
      take: limit,
      skip: limit * (page - 1),
      include: {
        tree: true,
      },
    }),
    prisma.projectHasTree.count({ where: { project: { slug } } }),
  ]);

  if (trees.length === 0) {
    throw new NotFoundError();
  }
  res.status(200).json(
    // Returns trees with their available stock for this project
    {
      total,
      limit,
      trees: trees.map(({ tree, stock }) => ({
        ...tree,
        stock,
      })),
    }
  );
}

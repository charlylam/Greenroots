import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { NotFoundError } from '../lib/errors.js';

const LIMIT = 9;

// ─────────────────────────────────────────────
// GET /api/trees
// ─────────────────────────────────────────────
export async function getAllTrees(req: Request, res: Response) {
  const page = Number(req.query.page) || 1;
  const search = req.query.search as string | undefined;
  const minPrice = req.query.minPrice
    ? parseFloat(req.query.minPrice as string)
    : undefined;
  const maxPrice = req.query.maxPrice
    ? parseFloat(req.query.maxPrice as string)
    : undefined;
  const sortBy = (req.query.sortBy as string) ?? 'commonName';
  const sortOrder = (req.query.sortOrder as string) === 'desc' ? 'desc' : 'asc';

  const where = {
    ...(search && {
      commonName: {
        contains: search,
        mode: 'insensitive' as const,
      },
    }),
    ...(minPrice !== undefined || maxPrice !== undefined
      ? {
          price: {
            ...(minPrice !== undefined && { gte: minPrice.toString() }),
            ...(maxPrice !== undefined && { lte: maxPrice.toString() }),
          },
        }
      : {}),
  };

  const [trees, total] = await prisma.$transaction([
    prisma.tree.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      take: LIMIT,
      skip: LIMIT * (page - 1),
      select: {
        id: true,
        commonName: true,
        family: true,
        origin: true,
        slug: true,
        picture: true,
        price: true,
      },
    }),
    prisma.tree.count({ where }),
  ]);

  if (trees.length === 0) {
    return res.json({ trees: [], total: 0, limit: LIMIT });
  }

  return res.json({
    trees: trees.map((t) => ({
      ...t,
      price: t.price.toNumber(),
    })),
    total,
    limit: LIMIT,
  });
}

// ─────────────────────────────────────────────
// GET /api/trees/:slug
// ─────────────────────────────────────────────
export async function getOneTree(req: Request, res: Response) {
  const slug = req.params.slug as string;

  const tree = await prisma.tree.findUnique({
    where: { slug },
    include: {
      projects: {
        include: {
          project: true,
        },
      },
    },
  });

  if (!tree) throw new NotFoundError('Tree not found');

  return res.json({
    ...tree,
    price: tree.price.toNumber(),
  });
}

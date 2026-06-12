import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

const router = Router();

const SUGGESTIONS = [
  "Offrir un arbre d'amour",
  'Offrir un arbre en hommage',
  'Offrir un arbre pour une crémaillère',
  'Offrir un arbre pour un baptême',
  'Offrir un arbre pour un anniversaire',
  'Offrir un arbre pour un mariage',
  'Offrir un arbre pour une naissance',
];

router.get('/', async (req, res) => {
  const query = (req.query.q as string)?.trim() ?? '';

  if (!query) {
    return res.json({ suggestions: [], trees: [], projects: [] });
  }

  const [trees, projects] = await Promise.all([
    prisma.tree.findMany({
      where: { commonName: { contains: query, mode: 'insensitive' } },
      select: {
        id: true,
        commonName: true,
        slug: true,
        price: true,
        picture: true,
      },
      take: 5,
    }),
    prisma.project.findMany({
      where: { name: { contains: query, mode: 'insensitive' } },
      select: { id: true, name: true, slug: true, picture: true },
      take: 4,
    }),
  ]);

  const suggestions = SUGGESTIONS.filter((s) =>
    s.toLowerCase().includes(query.toLowerCase())
  );

  res.json({ suggestions, trees, projects });
});

export default router;

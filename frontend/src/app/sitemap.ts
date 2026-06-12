import type { MetadataRoute } from 'next';
import { getAllTrees, getProjects } from '@/lib/api';

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://greenroots-frontend.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Pages statiques
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/arbres`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/projets`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/contact`, changeFrequency: 'monthly', priority: 0.5 },
  ];

  // Pages légales — rarement modifiées, faible priorité
  const legalRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/mentions-legales`,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/conditions-generales-ventes`,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/conditions-generales-utilisations`,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/politique-confidentialite`,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ];

  // Pages dynamiques — fiches arbres
  const trees = await getAllTrees();
  const treeRoutes: MetadataRoute.Sitemap = trees.map((tree) => ({
    url: `${BASE_URL}/arbres/${tree.slug}`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // Pages dynamiques — fiches projets
  const { projects } = await getProjects();
  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${BASE_URL}/projets/${project.slug}`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...legalRoutes, ...treeRoutes, ...projectRoutes];
}

import type { MetadataRoute } from 'next';

// URL de base du site, lue depuis l'environnement (différente entre staging et prod).
// Le fallback (??) garantit une valeur même si la variable n'est pas définie,
// donc le type reste 'string' et le sitemap n'aura jamais d'URL cassée.
const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://greenroots-frontend.vercel.app';

// Génère automatiquement la route /robots.txt (convention App Router :
// le nom du fichier robots.ts détermine le nom de la route).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      // S'applique à tous les robots
      userAgent: '*',
      // Autorise le crawl de tout le site par défaut.
      allow: '/',
      // Empêche le CRAWL des pages privées / transactionnelles.
      // Note : disallow bloque le crawl, pas l'indexation — c'est complémentaire
      // du noindex posé sur ces pages via leurs metadata.
      disallow: ['/panier', '/espace-client'],
    },
    // Indique aux moteurs où trouver le sitemap.
    // Doit être une URL absolue (contrainte du format robots.txt),
    // d'où le préfixe BASE_URL.
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}

import type { NextConfig } from 'next';

// On dérive l'adresse du backend depuis la variable d'env (une seule source de vérité).
// Fallback sur localhost pour ne pas casser le build si la variable est absente.
const apiUrl = new URL(
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
);

const isDev = process.env.NODE_ENV !== 'production';

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  reactCompiler: true,
  images: {
    dangerouslyAllowLocalIP: isDev, // ← seulement en dev autorise localhost (SSRF protection Next 16)

    // Autorise Next à optimiser les images servies par le backend (uploads).
    // remotePatterns est construit dynamiquement selon l'environnement (dev / prod).
    remotePatterns: [
      {
        // URL.protocol renvoie "http:" → on retire le ":" attendu par Next
        protocol: apiUrl.protocol.replace(':', '') as 'http' | 'https',
        hostname: apiUrl.hostname,
        // port vide en prod (Render utilise le port standard 443), "3001" en dev
        port: apiUrl.port || undefined,
      },
    ],
  },
};
export default nextConfig;

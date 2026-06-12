import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import TarteAuCitron from '@/components/layout/TarteAuCitron';
import { Inter, Montserrat } from 'next/font/google';
import '@/styles/globals.css';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { CartProvider } from '@/components/cart/CartProvider';

// Polices globales utilisées par l'application.
// `Inter` sert aux titres et `Montserrat` au texte courant via des variables CSS,
// ce qui permet de les réutiliser facilement dans toute l'interface.
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-heading',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-sans',
});

// Indexation pilotée par variable d'environnement.
// Permet d'autoriser l'indexation uniquement sur un vrai site de production,
// et de garder staging + déploiement de démo hors de l'index Google.
// (variable à définir côté Vercel : NEXT_PUBLIC_ALLOW_INDEXING=true/false)
const isIndexable = process.env.NEXT_PUBLIC_ALLOW_INDEXING === 'true';

// Métadonnées globales de l'application.
// Elles alimentent le titre de la page, l'aperçu dans les moteurs de recherche
// et les informations de base partagées sur tout le site.
export const metadata: Metadata = {
  // Titre en cascade : toutes les pages héritent du template du layout racine.
  title: {
    default: 'GreenRoots - Votre boutique pour la reforestation', // si une page ne définit pas de titre
    template: '%s - GreenRoots', // %s = le titre de la page enfant
  },
  // Description par défaut, héritée par les pages sans description propre.
  description:
    "GreenRoots est une boutique en ligne dédiée à la reforestation. En achetant chez nous, vous contribuez directement à la plantation d'arbres et à la préservation de notre planète.",
  // Balise <meta name="robots"> appliquée à tout le site.
  // index  : la page peut apparaître dans les résultats de recherche.
  // follow : les liens de la page peuvent être suivis par le crawler.
  // Ici piloté par l'environnement : tout passe en noindex hors prod réelle.
  robots: isIndexable
    ? { index: true, follow: true }
    : { index: false, follow: false },
};

// Layout racine de l'application Next.js.
// Il encapsule toutes les pages avec la structure commune : HTML, body,
// barre d'en-tête, pied de page, gestion du panier et bandeau cookies.
export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Lecture du cookie de session côté serveur pour savoir si l'utilisateur
  // est authentifié avant de rendre les composants partagés.
  const isLoggedIn = Boolean((await cookies()).get('token')?.value);
  return (
    // Les variables de police sont injectées directement sur la balise HTML
    // afin d'être disponibles dans l'ensemble de l'application.
    <html lang="fr" className={`${inter.variable} ${montserrat.variable}`}>
      {/* Le body structure toute la page en colonne pour garder le footer en bas */}
      <body className="min-h-full flex flex-col">
        {/* Le provider panier partage le compteur et la fonction de rafraîchissement
            à tous les composants descendants, sans prop drilling. */}
        <CartProvider isLoggedIn={isLoggedIn}>
          {/* L'en-tête reçoit l'état de connexion pour afficher les bons accès */}
          <Header isLoggedIn={isLoggedIn} />

          {/* Les pages Next.js sont injectées ici */}
          {children}

          {/* Footer commun à toutes les pages */}
          <Footer />

          {/* Bandeau de consentement cookies affiché globalement */}
          <TarteAuCitron />
        </CartProvider>
      </body>
    </html>
  );
}

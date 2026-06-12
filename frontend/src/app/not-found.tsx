import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';

// ============================================================
//  Page 404 — affichée automatiquement par Next.js quand l'URL
//  ne correspond à aucune route (App Router convention).
// ============================================================

// Métadonnées SEO de la page 404 :
// - Titre custom pour l'onglet du navigateur
// - Description (utile aussi pour les outils de monitoring)
// - robots: noindex pour empêcher Google d'indexer la page d'erreur
export const metadata: Metadata = {
  title: 'Page introuvable',
  description:
    "Cette page n'existe pas ou a été déplacée. Retour à l'accueil GreenRoots.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden">
      {/* Illustration en arrière-plan plein écran */}
      <Image
        src="/images/background-image-main.jpg"
        alt="Personnage GreenRoots perdu dans la forêt, illustration d'une page 404"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      {/*
        Overlay sombre visible UNIQUEMENT sur mobile pour assombrir
        l'illustration et garantir la lisibilité du texte blanc.
        Sur desktop (md+), on garde l'image intacte car le texte se
        place à gauche dans la zone vide de l'illustration.
      */}
      <div className="absolute inset-0 bg-brand-dark/60 md:hidden" />

      {/*
        Contenu principal :
        - Sur mobile : texte centré (1 colonne) dans une carte sombre
        - Sur desktop : 2 colonnes (texte à gauche, gros "404" à droite)
      */}
      <section className="relative z-10 flex min-h-screen items-center justify-center px-6 py-16 md:justify-between md:px-10 lg:px-20">
        {/* TEXTE À GAUCHE (mobile : carte sombre pour le contraste) */}
        <div className="w-full max-w-xl rounded-2xl bg-brand-dark/70 p-6 text-center text-brand-white backdrop-blur-sm sm:p-8 md:bg-transparent md:p-0 md:text-left md:backdrop-blur-none">
          <h1 className="text-2xl font-black uppercase leading-tight tracking-tight sm:text-3xl lg:text-4xl">
            Oups... Page perdue dans la forêt
          </h1>

          <p className="mt-5 text-sm text-brand-white sm:text-base">
            Je n&apos;arrive vraiment pas à trouver la page que vous cherchez.
            <br />
            <br />
            Peut-être qu&apos;elle a existé un jour ? Peut-être qu&apos;elle
            n&apos;a jamais existé ?
            <br />
            <br />
            Quoi qu&apos;il en soit, pas de panique ! Vous pouvez retourner à
            l&apos;accueil.
          </p>

          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row md:justify-start">
            <Link href="/" className="w-full sm:w-auto">
              <Button className="h-11 w-full rounded-md bg-brand-accent px-6 font-semibold text-brand-white hover:bg-brand-dark sm:w-auto">
                Retour à l&apos;accueil
              </Button>
            </Link>

            <Link href="/projets" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="h-11 w-full rounded-md border-2 border-brand-white px-6 font-semibold text-brand-white hover:bg-brand-dark hover:text-brand-white sm:w-auto"
              >
                Voir les projets
              </Button>
            </Link>
          </div>
        </div>

        {/*
          GROS "404" À DROITE
          - Caché sur mobile (hidden), visible à partir de md
          - aria-hidden : c'est un élément décoratif, le contexte
            "404" est déjà donné par le titre et la metadata.
        */}
        <div
          aria-hidden="true"
          className="hidden select-none font-black leading-none tracking-tighter text-brand-white/90 drop-shadow-2xl md:block md:text-[12rem] lg:text-[16rem] xl:text-[20rem]"
        >
          404
        </div>
      </section>
    </main>
  );
}

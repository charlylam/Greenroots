import Title from '@/components/layout/Title';
import { Metadata } from 'next';
import type { TreesSearchParams } from '@/types/index';
import { Suspense } from 'react';
import TreesContent from '@/components/layout/TreesContent';
import TreesSkeleton from '@/components/layout/TreesSkeleton';

export const metadata: Metadata = {
  title: 'Nos arbres',
  description:
    "Découvrez notre sélection d'arbres à planter à travers le monde. Participez à la reforestation en choisissant l'arbre qui vous correspond.",
};

export default async function TreesPage({
  searchParams,
}: {
  searchParams: TreesSearchParams;
}) {
  return (
    <main>
      <Title title="Nos arbres" />

      {/*
        aria-label : nomme la section pour les lecteurs d'écran,
        utile si la page contient plusieurs <section>.
      */}
      <section
        className="bg-brand-bg px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
        aria-label="Liste des arbres disponibles"
      >
        <div className="mx-auto max-w-7xl p-8 text-brand-dark">
          {/*
            aria-busy="true" pendant le chargement : signale aux lecteurs
            d'écran que le contenu est en cours de chargement.
            Suspense gère l'affichage du skeleton côté visuel.
          */}
          <Suspense fallback={<TreesSkeleton />}>
            <TreesContent searchParams={searchParams} />
          </Suspense>
        </div>
      </section>
    </main>
  );
}

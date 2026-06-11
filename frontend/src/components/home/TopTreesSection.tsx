// Section de la page d'accueil dédiée aux arbres les plus vendus.
// Elle affiche 3 arbres dynamiques et une carte fixe orientée entreprise.

import Image from 'next/image';
import Link from 'next/link';

import TreeCard from '@/components/home/TreeCard';
import { Button } from '@/components/ui/button';
import { getTrees } from '@/lib/api';

export default async function TopTreesSection() {
  let topTrees = null;

  try {
    // Récupération des arbres depuis l'API backend.
    const { trees } = await getTrees(1);
    // On gardera les 3 premiers pour la section "arbres les plus vendus".
    topTrees = trees.slice(0, 3);
  } catch (error) {
    // En cas d'erreur, on logge pour le debug et on affiche un fallback
    // plus bas sans planter la page.
    console.error('[TopTreesSection] fetch échoué :', error);
  }
  if (!topTrees) {
    return (
      <section className="bg-brand-bg px-4 py-16 text-brand-dark sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">
            Les arbres les plus vendus
          </h2>
          <p className="mx-auto max-w-2xl mt-12 text-center text-brand-dark">
            Les arbres ne sont pas disponibles.
          </p>
          <div className="mt-12 text-center">
            <p className="mx-auto max-w-2xl text-lg text-brand-dark">
              Chaque arbre financé contribue à restaurer des écosystèmes,
              soutenir les communautés locales et construire un avenir plus
              durable.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-brand-bg px-4 py-16 text-brand-dark sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center text-2xl font-bold sm:text-3xl">
          Les arbres les plus vendus
        </h2>

        <div className="mt-10 grid justify-center gap-6 sm:grid-cols-[repeat(2,18rem)] lg:grid-cols-[repeat(4,18rem)]">
          {topTrees[0] && <TreeCard tree={topTrees[0]} />}
          {topTrees[1] && <TreeCard tree={topTrees[1]} />}

          {/* Carte fixe dédiée aux entreprises */}
          <div className="relative flex h-[470px] w-72 flex-col justify-between overflow-hidden rounded-xl bg-brand-dark p-6 text-brand-white shadow-lg transition-shadow hover:shadow-xl">
            <Image
              src="/images/home/impact/impact-6.jpg"
              alt="Forêt illustrant la section dédiée aux offres d'entreprise de reforestation"
              fill
              sizes="288px"
              className="object-cover opacity-30"
            />
            <div className="relative z-10">
              <h3 className="text-lg font-bold">
                Plantez au nom de votre entreprise
              </h3>

              <p className="mt-6 text-sm">
                Soutenez la reforestation et réduisez votre impact carbone.
              </p>

              <p className="mt-6 text-sm">
                Financez des arbres pour soutenir des projets concrets de
                reforestation.
              </p>

              <p className="mt-4 text-sm">
                Transformez votre engagement en actions.
              </p>
            </div>

            <Button
              asChild
              className="relative z-10 w-full bg-brand-accent text-brand-dark hover:bg-brand-accent/90"
            >
              <Link href="/arbres" className="!text-brand-white/80">
                Voir tous les arbres
              </Link>
            </Button>
          </div>

          {topTrees[2] && <TreeCard tree={topTrees[2]} />}
        </div>
        <div className="mt-12 text-center">
          <p className="mx-auto max-w-2xl text-lg text-brand-darck">
            Chaque arbre financé contribue à restaurer des écosystèmes, soutenir
            les communautés locales et construire un avenir plus durable.
          </p>
        </div>
      </div>
    </section>
  );
}

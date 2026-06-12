import Title from '@/components/layout/Title';
import { Metadata } from 'next';
import ProjectsContent from '@/components/layout/ProjectsContent';
import { Suspense } from 'react';
import ProjectsSkeleton from '@/components/layout/ProjectsSkeleton';
import type { ProjectsSearchParams } from '@/types/index';

export const metadata: Metadata = {
  title: 'Nos projets de reforestation',
  description:
    "Découvrez nos projets de reforestation à travers le monde. Participez à la lutte contre le changement climatique en soutenant nos initiatives de plantation d'arbres.",
};

export default function ProjectsPage({
  searchParams,
}: {
  searchParams: ProjectsSearchParams;
}) {
  return (
    <main>
      <Title title="Nos projets" />

      <section
        className="bg-brand-bg px-4 py-4 sm:px-4 lg:px-4 lg:py-2"
        aria-label="Notre approche"
      >
        <div className="mx-auto max-w-7xl p-8 text-brand-dark">
          <p className="pb-4">
            Chez GreenRoots, chaque projet de reforestation naît d&apos;un
            partenariat avec des acteurs locaux engagés&nbsp;: associations,
            coopératives agricoles et communautés qui connaissent leur
            territoire mieux que quiconque. Nous sélectionnons des essences
            indigènes, adaptées au climat et aux sols de chaque région, pour
            garantir des plantations durables qui renforcent les écosystèmes
            existants plutôt que de les fragiliser. De la pépinière à la mise en
            terre, chaque arbre est suivi pour maximiser ses chances de
            croissance et son impact réel sur la biodiversité.
          </p>
          <p className="pb-4">
            Au-delà de la plantation, nos projets soutiennent les populations
            qui en prennent soin au quotidien. Restaurer une forêt, c&apos;est
            aussi créer des emplois locaux, protéger les ressources en eau,
            stabiliser les sols agricoles et capter durablement du carbone. En
            finançant un projet GreenRoots, vous ne plantez pas seulement un
            arbre&nbsp;: vous participez à une démarche concrète de régénération
            environnementale et sociale, dont vous pouvez suivre
            l&apos;avancement en toute transparence.
          </p>
        </div>
      </section>

      <section
        className="bg-brand-bg px-4 pt-4 pb-16 sm:px-6 lg:px-8 lg:pt-4 lg:pb-20"
        aria-label="Liste des projets de reforestation"
      >
        <div className="mx-auto max-w-7xl p-8 text-brand-dark">
          <Suspense fallback={<ProjectsSkeleton />}>
            <ProjectsContent searchParams={searchParams} />
          </Suspense>
        </div>
      </section>
    </main>
  );
}

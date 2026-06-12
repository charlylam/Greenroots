'use client';

// Carrousel des projets de la page d'accueil.
// Il affiche 4 projets à la fois, sans carte coupée, avec une navigation circulaire.

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { getImageUrl } from '@/lib/images';

type ProjectsCarouselProps = {
  projects: {
    id: number;
    name: string;
    shortDescription: string;
    slug: string;
    localisation: string;
    picture: string;
    progress: number;
  }[];
};

function ProjectCard({
  project,
}: {
  project: ProjectsCarouselProps['projects'][number];
}) {
  return (
    <Card className="flex h-[520px] w-72 overflow-hidden bg-brand-white pt-0 text-brand-dark transition-shadow hover:shadow-lg">
      <div className="relative h-48 w-full shrink-0 overflow-hidden">
        <Image
          src={getImageUrl(project.picture)}
          alt={project.name}
          fill
          sizes="288px"
          className="object-cover"
        />
      </div>

      <CardHeader>
        <CardTitle>{project.name}</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col space-y-4">
        <p className="text-sm text-brand-muted">{project.shortDescription}</p>

        <p className="text-sm font-medium">{project.localisation}</p>

        <div className="mt-auto space-y-4">
          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span>Progression</span>
              <span>{project.progress}%</span>
            </div>

            <Progress value={project.progress} />
          </div>

          <Button
            asChild
            className="w-full bg-brand-accent text-brand-dark hover:bg-brand-accent/80"
          >
            <Link href={`/projets/${project.slug}`}>Voir le projet</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ProjectsCarousel({ projects }: ProjectsCarouselProps) {
  const ref = useRef<HTMLDivElement>(null);

  if (projects.length === 0) {
    return null;
  }

  const scroll = (dir: 'left' | 'right') => {
    if (ref.current) {
      ref.current.scrollBy({
        left: dir === 'left' ? -312 : 312,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="relative overflow-hidden bg-brand-dark px-4 py-16 text-brand-white sm:px-6 lg:px-8">
      {/* Blobs lumineux décoratifs */}
      <div className="pointer-events-none absolute -left-50 top-30 h-120 w-65 rounded-full bg-brand-accent/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        {/* Titre de la section projets */}
        <h2 className="text-center text-2xl font-bold sm:text-3xl">
          Choisissez le projet que vous souhaitez soutenir
        </h2>

        <div className="relative mt-10">
          {/* Bouton gauche */}
          <button
            type="button"
            onClick={() => scroll('left')}
            aria-label="Projet précédent"
            className="absolute -left-6 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-brand-accent text-2xl text-brand-white shadow transition hover:opacity-80"
          >
            ‹
          </button>
          <div
            ref={ref}
            className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide px-6 sm:px-12 snap-x snap-mandatory"
          >
            {projects.map((project) => (
              <div key={project.id} className="flex-shrink-0 snap-center">
                <ProjectCard project={project} />
              </div>
            ))}
          </div>

          {/* Bouton droite */}
          <button
            type="button"
            onClick={() => scroll('right')}
            aria-label="Projet suivant"
            className="absolute -right-6 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-brand-accent text-2xl text-brand-white shadow transition hover:opacity-80"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}

import { getProjects } from '@/lib/api';
import ProjectsCarousel from './ProjectsCarousel';

export async function ProjectsCarouselFetcher() {
  let projects = null;

  try {
    // Récupération des projets depuis l'API backend.
    const data = await getProjects();
    projects = data.projects;
  } catch (error) {
    // En cas d'erreur, on logge pour le debug et on affiche un fallback
    // plus bas sans planter la page.
    console.error('[ProjectsSection] fetch échoué :', error);
  }

  // Si la récupération a échoué ou que la réponse ne contient pas de projets,
  // on affiche un message de fallback au lieu du carrousel.
  if (!projects) {
    return (
      <section className="bg-brand-dark px-4 py-16 text-brand-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Choisissez le projet que vous souhaitez soutenir
          </h2>
          <p className="mt-6 text-brand-white/50 text-sm tracking-widest">
            Les projets ne sont pas disponibles pour le moment.
          </p>
        </div>
      </section>
    );
  }

  // La page d'accueil les utilise dans le carrousel des projets.
  return <ProjectsCarousel projects={projects} />;
}

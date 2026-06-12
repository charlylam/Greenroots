// Présentation de quelques projets de reforestation terminés.
// Cette section sert de preuve sociale avant le footer.

import Image from 'next/image';

const completedProjects = [
  {
    country: 'Mexique',
    trees: '18 000',
    image: '/images/home/completed/mexico.jpg',
  },
  {
    country: 'Congo',
    trees: '32 000',
    image: '/images/home/completed/congo.jpg',
  },
  {
    country: 'Indonésie',
    trees: '21 000',
    image: '/images/home/completed/indonesia.jpg',
  },
];

export default function CompletedProjectsSection() {
  return (
    <section className="relative overflow-hidden bg-brand-dark px-4 py-16 text-brand-white sm:px-6 lg:px-8 lg:py-20">
      <div className="pointer-events-none absolute -left-50 top-45 h-110 w-65 rounded-full bg-brand-accent/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-50 h-75 w-65 rounded-full bg-brand-accent/30 blur-3xl" />
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center text-3xl font-bold">
          Des projets déjà réalisés à travers le monde
        </h2>

        <p className="mx-auto mt-6 max-w-3xl text-center leading-relaxed text-brand-white">
          Grâce au soutien de notre communauté, plusieurs opérations de
          reforestation ont déjà été menées à terme dans différentes régions du
          monde.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {completedProjects.map((project) => (
            <div
              key={project.country}
              className="overflow-hidden rounded-[28px] bg-brand-white shadow-[0_20px_50px_rgba(33,42,37,0.08)]"
            >
              <div className="relative h-56">
                <Image
                  src={project.image}
                  alt={project.country}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-brand-dark">
                  {project.country}
                </h3>

                <p className="mt-4 text-3xl font-bold text-brand-accent">
                  {project.trees}
                </p>

                <p className="text-brand-white">arbres plantés</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-[28px] bg-brand-dark p-8 text-center text-brand-white">
          <p className="text-5xl font-bold text-brand-accent">71 000</p>

          <p className="mt-3 text-lg">
            arbres plantés dans nos projets terminés
          </p>
        </div>
      </div>
    </section>
  );
}

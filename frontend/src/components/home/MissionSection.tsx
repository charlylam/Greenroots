import Image from 'next/image';

// Présentation de GreenRoots et de sa mission.
// Cette section crée une transition entre les projets et les arbres.

export default function MissionSection() {
  return (
    <section className="relative overflow-hidden bg-brand-dark px-4 py-16 text-brand-white sm:px-6 lg:px-8 lg:py-20">
      <div className="pointer-events-none absolute -right-32 bottom-30 h-75 w-65 rounded-full bg-brand-accent/30 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Bloc principal recentré */}
        <div className="mx-auto max-w-3xl">
          {/* Titre principal */}
          <h2 className="text-4xl font-bold sm:text-5xl lg:text-4xl">
            Notre vision :
          </h2>

          {/* Sous-titre */}
          <p className="mt-4 text-3xl font-bold leading-tight sm:ml-20 sm:text-4xl lg:text-3xl">
            Planter aujourdhui pour un avenir durable.
          </p>

          {/* Image + texte */}
          <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_1fr]">
            {/* Image à gauche */}
            <div className="flex justify-start">
              <Image
                src="/images/home/mission/mosaic-ter.jpg"
                alt="Projet de reforestation montrant une mosaïque de zones plantées d'arbres et de végétation restaurée"
                width={420}
                height={270}
                className="rounded-[28px]"
              />
            </div>

            {/* Texte à droite */}
            <div className="max-w-md text-base font-semibold leading-relaxed text-brand-white/85">
              <p>
                GreenRoots est née d&apos;une conviction simple : chaque arbre
                planté peut contribuer à restaurer les écosystèmes et soutenir
                les communautés locales.
              </p>

              <p className="mt-8">
                Au fil des années, nous avons accompagné des projets de
                reforestation à travers le monde, en sélectionnant des essences
                adaptées aux besoins de chaque territoire et en collaborant avec
                des acteurs locaux engagés.
              </p>
            </div>
          </div>
        </div>

        {/* Chiffres clés */}
        <div className="mt-28 grid gap-8 text-center md:grid-cols-3">
          <div>
            <p className="text-5xl font-bold text-brand-accent">12</p>
            <p className="mt-2 text-brand-white">projets accompagnés</p>
          </div>

          <div>
            <p className="text-5xl font-bold text-brand-accent">145 000</p>
            <p className="mt-2 text-brand-white">arbres plantés</p>
          </div>

          <div>
            <p className="text-5xl font-bold text-brand-accent">8</p>
            <p className="mt-2 text-brand-white">pays concernés</p>
          </div>
        </div>
      </div>
    </section>
  );
}

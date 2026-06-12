// Section d'impact de la page d'accueil.
// Elle explique la valeur ajoutée de GreenRoots et présente une galerie photo.

import Image from 'next/image';

export default function ImpactSection() {
  const steps = [
    'Choisissez un projet de reforestation',
    'Sélectionnez l’arbre que vous souhaitez financer',
    'Suivez l’impact de votre contribution',
  ];

  return (
    <section className="bg-brand-bg px-4 py-16 text-brand-dark sm:px-6 lg:px-8">
      <div className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-2 lg:items-stretch">
        {/* Bloc texte : explique l'impact concret de l'achat d'un arbre */}
        <div className="rounded-[28px] border border-brand-dark/10 bg-brand-white p-12 shadow-[0_20px_50px_rgba(33,42,37,0.08)]">
          <h2 className="max-w-xl text-3xl font-bold leading-tight text-brand-dark">
            Un achat, un impact réel
          </h2>

          <p className="mt-8 leading-relaxed text-brand-dark">
            Chaque arbre acheté contribue directement à un projet de
            reforestation sélectionné par GreenRoots.
          </p>

          <p className="mt-6 leading-relaxed text-brand-dark">
            Vous participez à la restauration des écosystèmes, au soutien de la
            biodiversité et à la plantation d&apos;arbres adaptés aux besoins de
            chaque territoire.
          </p>

          {/* Parcours utilisateur GreenRoots */}
          <div className="mt-10 space-y-4">
            {steps.map((step, index) => (
              <div
                key={step}
                className="flex items-center gap-4 rounded-xl bg-brand-bg p-4"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-accent font-bold text-brand-dark">
                  {index + 1}
                </div>

                <p className="text-sm font-medium text-brand-dark">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Galerie verticale inspirée de la maquette */}
        <div className="grid min-h-[420px] grid-cols-5 gap-0">
          {[1, 2, 3, 4, 5].map((imageNumber) => (
            <div key={imageNumber} className="relative overflow-hidden">
              <Image
                src={`/images/home/impact/impact-${imageNumber}.jpg`}
                alt={`Impact GreenRoots ${imageNumber}`}
                fill
                sizes="20vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

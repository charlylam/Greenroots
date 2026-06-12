import Image from 'next/image';
import Link from 'next/link';
import { Eye, MapPin, Sparkles } from 'lucide-react';

import Title from '@/components/layout/Title';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'À propos',
  description:
    'GreenRoots — notre mission : replanter la planète en rendant la reforestation accessible à tous.',
};

export default function AboutPage() {
  return (
    <main>
      <Title title="À propos" />
      <section
        className="bg-brand-bg px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
        aria-label="À propos de GreenRoots"
      >
        <div className="mx-auto max-w-4xl space-y-12 text-brand-dark">
          <header className="text-center space-y-3">
            <h2 className="text-3xl font-bold">À propos de GreenRoots</h2>
            <p className="text-brand-dark">
              GreenRoots est une boutique solidaire dédiée à la reforestation.
              En commandant chez nous, vous financez directement la plantation
              d&apos;arbres et soutenez des projets locaux et transparents.
            </p>
          </header>

          <section aria-labelledby="heading-mission" className="space-y-4">
            <h3 id="heading-mission" className="text-xl font-semibold">
              Notre mission
            </h3>
            <p className="text-brand-dark">
              Nous croyons qu&apos;un petit geste de chacun peut avoir un grand
              impact. GreenRoots facilite la contribution à la restauration des
              écosystèmes en connectant des acheteurs responsables à des projets
              de reforestation certifiés.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <li className="rounded-2xl border border-border p-5 bg-card">
                <Eye className="size-8 text-primary mb-3" aria-hidden="true" />
                <h4 className="font-semibold mb-2 text-primary">
                  Transparence
                </h4>
                <p className="text-sm text-brand-dark">
                  Suivi clair des projets.
                </p>
              </li>
              <li className="rounded-2xl border border-border p-5 bg-card">
                <MapPin
                  className="size-8 text-primary mb-3"
                  aria-hidden="true"
                />
                <h4 className="font-semibold mb-2 text-primary">
                  Impact local
                </h4>
                <p className="text-sm text-brand-dark">
                  Soutien aux communautés.
                </p>
              </li>
              <li className="rounded-2xl border border-border p-5 bg-card">
                <Sparkles
                  className="size-8 text-primary mb-3"
                  aria-hidden="true"
                />
                <h4 className="font-semibold mb-2 text-primary">Qualité</h4>
                <p className="text-sm text-brand-dark">
                  Sélection d&apos;essences adaptées.
                </p>
              </li>
            </ul>
          </section>

          <section
            aria-labelledby="heading-how"
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
          >
            <div className="space-y-4">
              <h3 id="heading-how" className="text-xl font-semibold">
                Comment ça marche
              </h3>
              <ol className="list-decimal list-inside space-y-3 text-brand-dark">
                <li>
                  Choisissez un arbre ou un projet sur notre boutique et passez
                  commande.
                </li>
                <li>
                  Une partie du montant finance la plantation et la maintenance
                  des arbres.
                </li>
                <li>
                  Nous fournissons des mises à jour et des preuves de plantation
                  lorsque disponibles.
                </li>
              </ol>
            </div>

            {/* Colonne droite : 3 images empilées et alignées */}
            <div className="grid grid-cols-1 gap-3">
              <div className="relative h-40 w-full overflow-hidden rounded-2xl">
                <Image
                  src="/images/a-propos/aditya-sethia-kRtRPB3v9Ts-unsplash.jpg"
                  alt="Vue aérienne d'une forêt dense avec canopée verdoyante"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>

              <div className="relative h-40 w-full overflow-hidden rounded-2xl">
                <Image
                  src="/images/a-propos/alexey-demidov-Z-5ctVlACa4-unsplash.jpg"
                  alt="Équipe de bénévoles plantant de jeunes arbres en terre"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>

              <div className="relative h-40 w-full overflow-hidden rounded-2xl">
                <Image
                  src="/images/a-propos/gregor-scheithauer-0uO6qhd6Bi8-unsplash.jpg"
                  alt="Jeunes plants d'arbres en pépinière prêts à être transplantés"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
            </div>
          </section>

          <section aria-labelledby="heading-team" className="space-y-4">
            <h3 id="heading-team" className="text-xl font-semibold">
              Notre équipe
            </h3>
            <p className="text-brand-dark">
              Cinq passionnés, chacun veillant à un pilier essentiel de
              GreenRoots pour vous garantir une expérience fiable, sécurisée et
              utile.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <li className="rounded-2xl border border-border p-5 bg-card text-center">
                <p className="font-semibold">Camille</p>
                <p className="text-sm text-brand-dark mt-1">
                  Responsable de l&apos;expérience visiteur
                </p>
              </li>
              <li className="rounded-2xl border border-border p-5 bg-card text-center">
                <p className="font-semibold">Charly</p>
                <p className="text-sm text-brand-dark mt-1">
                  Responsable sécurité &amp; comptes utilisateurs
                </p>
              </li>
              <li className="rounded-2xl border border-border p-5 bg-card text-center">
                <p className="font-semibold">Justine</p>
                <p className="text-sm text-brand-dark mt-1">
                  Responsable catalogue d&apos;arbres
                </p>
              </li>
              <li className="rounded-2xl border border-border p-5 bg-card text-center">
                <p className="font-semibold">François</p>
                <p className="text-sm text-brand-dark mt-1">
                  Responsable fiabilité &amp; conformité
                </p>
              </li>
              <li className="rounded-2xl border border-border p-5 bg-card text-center">
                <p className="font-semibold">Wafa</p>
                <p className="text-sm text-brand-dark mt-1">
                  Responsable espace client &amp; commandes
                </p>
              </li>
            </ul>
          </section>

          <section
            aria-labelledby="heading-cta"
            className="text-center space-y-4"
          >
            <h3 id="heading-cta" className="sr-only">
              Nous contacter
            </h3>
            <p className="text-brand-dark">
              Vous voulez en savoir plus ou devenir partenaire&nbsp;?
            </p>
            <Link href="/contact" className="inline-block">
              <Button className="bg-brand-dark text-white hover:bg-brand-accent hover:text-brand-dark">
                Nous contacter
              </Button>
            </Link>
          </section>
        </div>
      </section>
    </main>
  );
}

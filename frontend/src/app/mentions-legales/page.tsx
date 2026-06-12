import Title from '@/components/layout/Title';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mentions légales',
  description:
    'Découvrez les mentions légales du site GreenRoots et participez activement à des projets de reforestation.',
};

export default function LegalNoticePage() {
  return (
    <main>
      <Title title="Mentions légales" />

      <section className="bg-brand-bg px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-5xl rounded-3xl bg-brand-white p-8 text-brand-dark shadow-lg sm:p-10 lg:p-12">
          <div className="mb-10 space-y-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-accent">
              Informations juridiques
            </p>

            <h2 className="text-3xl font-bold">
              Mentions légales de GreenRoots
            </h2>

            <p className="max-w-3xl text-brand-muted">
              Cette page présente les informations légales relatives à
              l’édition, l’hébergement et l’utilisation du site GreenRoots.
            </p>
          </div>

          <div className="space-y-8">
            <section className="rounded-2xl border border-brand-muted/30 p-6">
              <h3 className="mb-3 text-xl font-bold">Éditeur du site</h3>
              <p>
                GreenRoots est un projet pédagogique réalisé dans le cadre d’une
                formation en développement web. Le site n’a aucune vocation
                commerciale et aucune vente n’y est effectuée. Les informations
                légales présentées sur cette page sont provisoires et seront
                complétées au fur et à mesure de l’avancement du projet.
              </p>
            </section>

            <section className="rounded-2xl border border-brand-muted/30 p-6">
              <h3 className="mb-3 text-xl font-bold">Hébergement</h3>
              <p>
                Les informations relatives à l’hébergeur du site seront
                précisées ultérieurement.
              </p>
            </section>

            <section className="rounded-2xl border border-brand-muted/30 p-6">
              <h3 className="mb-3 text-xl font-bold">
                Propriété intellectuelle
              </h3>
              <p>
                Les contenus présents sur le site, notamment les textes, logos
                et éléments graphiques, sont utilisés dans le cadre du projet
                GreenRoots. Ils ne peuvent être reproduits ou réutilisés sans
                l’accord de l’équipe projet.
              </p>
            </section>

            <p className="text-sm text-brand-muted">
              Dernière mise à jour : le 29/05/2026.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

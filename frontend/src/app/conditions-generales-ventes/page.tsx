import Title from '@/components/layout/Title';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Conditions générales de vente',
  description:
    'Découvrez les conditions générales de vente du site GreenRoots et participez activement à des projets de reforestation.',
};

export default function TermsOfSalePage() {
  return (
    <main>
      <Title title="Conditions générales de vente" />

      <section className="bg-brand-bg px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-5xl rounded-3xl bg-brand-white p-8 text-brand-dark shadow-lg sm:p-10 lg:p-12">
          <div className="mb-10 space-y-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-accent">
              Vente et commandes
            </p>

            <h2 className="text-3xl font-bold">
              Conditions générales de vente de GreenRoots
            </h2>

            <p className="max-w-3xl text-brand-muted">
              Cette page présente les conditions générales de vente applicables
              aux services et produits proposés sur GreenRoots.
            </p>
          </div>

          <div className="space-y-8">
            <section className="rounded-2xl border border-brand-muted/30 p-6">
              <h3 className="mb-3 text-xl font-bold">Objet</h3>
              <p>
                Les présentes conditions générales de vente définissent les
                modalités applicables aux commandes effectuées sur GreenRoots.
              </p>
            </section>

            <section className="rounded-2xl border border-brand-muted/30 p-6">
              <h3 className="mb-3 text-xl font-bold">Projet pédagogique</h3>
              <p>
                GreenRoots est actuellement un projet fictif réalisé dans le
                cadre d’une formation. Aucune vente réelle n’est effectuée sur
                ce site.
              </p>
            </section>

            <section className="rounded-2xl border border-brand-muted/30 p-6">
              <h3 className="mb-3 text-xl font-bold">Prix</h3>
              <p>
                Les prix affichés sur le site sont présentés à titre
                d’illustration et ne constituent pas une offre commerciale.
              </p>
            </section>

            <section className="rounded-2xl border border-brand-muted/30 p-6">
              <h3 className="mb-3 text-xl font-bold">Paiement</h3>
              <p>
                Aucun paiement réel n’est traité dans le cadre de ce projet
                pédagogique.
              </p>
            </section>

            <section className="rounded-2xl border border-brand-muted/30 p-6">
              <h3 className="mb-3 text-xl font-bold">Livraison</h3>
              <p>
                Aucune livraison physique ou numérique n’est réalisée via ce
                site dans sa version actuelle.
              </p>
            </section>

            <section className="rounded-2xl border border-brand-muted/30 p-6">
              <h3 className="mb-3 text-xl font-bold">Modification des CGV</h3>
              <p>
                GreenRoots se réserve le droit de modifier les présentes
                conditions générales de vente à tout moment afin de les adapter
                à l’évolution du projet.
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

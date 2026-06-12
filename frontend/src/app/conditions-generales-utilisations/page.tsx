import Title from '@/components/layout/Title';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation",
  description:
    "Découvrez les conditions générales d'utilisation du site GreenRoots et participez activement à des projets de reforestation.",
};

export default function TermsOfUsePage() {
  return (
    <main>
      <Title title="Conditions générales d’utilisation" />

      <section className="bg-brand-bg px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-5xl rounded-3xl bg-brand-white p-8 text-brand-dark shadow-lg sm:p-10 lg:p-12">
          <div className="mb-10 space-y-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-accent">
              Utilisation du site
            </p>

            <h2 className="text-3xl font-bold">
              Conditions générales d&apos;utilisation de GreenRoots
            </h2>

            <p className="max-w-3xl text-brand-muted">
              Cette page présente les règles d&apos;utilisation du site
              GreenRoots et de ses fonctionnalités.
            </p>
          </div>

          <div className="space-y-8">
            <section className="rounded-2xl border border-brand-muted/30 p-6">
              <h3 className="mb-3 text-xl font-bold">Présentation du site</h3>
              <p>
                GreenRoots est un projet fictif réalisé dans le cadre d’une
                formation. Le site permet de découvrir des arbres et des projets
                de reforestation.
              </p>
            </section>

            <section className="rounded-2xl border border-brand-muted/30 p-6">
              <h3 className="mb-3 text-xl font-bold">Accès au site</h3>
              <p>
                L’accès au site est libre. Certaines fonctionnalités peuvent
                nécessiter la création d’un compte utilisateur.
              </p>
            </section>

            <section className="rounded-2xl border border-brand-muted/30 p-6">
              <h3 className="mb-3 text-xl font-bold">Compte utilisateur</h3>
              <p>
                L’utilisateur s’engage à fournir des informations exactes lors
                de son inscription et à préserver la confidentialité de ses
                identifiants.
              </p>
            </section>

            <section className="rounded-2xl border border-brand-muted/30 p-6">
              <h3 className="mb-3 text-xl font-bold">Responsabilité</h3>
              <p>
                Les informations présentes sur le site sont fournies à titre
                indicatif dans le cadre d’un projet pédagogique fictif.
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

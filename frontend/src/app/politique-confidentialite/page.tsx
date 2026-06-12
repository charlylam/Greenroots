import Title from '@/components/layout/Title';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Politique de confidentialité',
  description:
    'Découvrez notre politique de confidentialité et participez activement à des projets de reforestation.',
};

export default function PrivacyPolicyPage() {
  return (
    <main>
      <Title title="Politique de confidentialité" />

      <section className="bg-brand-bg px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-5xl rounded-3xl bg-brand-white p-8 text-brand-dark shadow-lg sm:p-10 lg:p-12">
          <div className="mb-10 space-y-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-accent">
              Protection des données
            </p>

            <h2 className="text-3xl font-bold">
              Politique de confidentialité de GreenRoots
            </h2>

            <p className="max-w-3xl text-brand-muted">
              Cette politique de confidentialité explique quelles données
              personnelles peuvent être collectées lors de l&apos;utilisation du
              site GreenRoots, comment elles sont utilisées, conservées et
              protégées, ainsi que les droits dont vous disposez conformément au
              Règlement Général sur la Protection des Données (RGPD).
            </p>
          </div>

          <div className="space-y-8">
            <section className="rounded-2xl border border-brand-muted/30 p-6">
              <h3 className="mb-3 text-xl font-bold">
                Responsable du traitement
              </h3>

              <p>
                GreenRoots est un projet pédagogique réalisé dans le cadre
                d&apos;une formation en développement web. Dans le cadre de
                l&apos;utilisation du site, certaines données personnelles
                peuvent être collectées afin de permettre le bon fonctionnement
                des services proposés.
              </p>

              <p className="mt-4">
                Le responsable du traitement des données est l&apos;équipe en
                charge du projet GreenRoots.
              </p>
            </section>

            <section className="rounded-2xl border border-brand-muted/30 p-6">
              <h3 className="mb-3 text-xl font-bold">Données collectées</h3>

              <p>
                Lors de l&apos;utilisation du site, GreenRoots peut être amené à
                collecter les données suivantes :
              </p>

              <ul className="mt-4 list-disc space-y-2 pl-6">
                <li>Nom et prénom </li>
                <li>Adresse électronique </li>
                <li>Type de compte utilisateur </li>
                <li>Numéro SIRET pour les comptes professionnels </li>
                <li>Données relatives aux commandes et au panier </li>
                <li>Adresse IP et données de connexion </li>
                <li>Informations techniques liées au navigateur utilisé </li>
                <li>Préférences relatives aux cookies</li>
              </ul>
            </section>

            <section className="rounded-2xl border border-brand-muted/30 p-6">
              <h3 className="mb-3 text-xl font-bold">Modalités de collecte</h3>

              <p>
                Les données personnelles peuvent être collectées de différentes
                manières :
              </p>

              <ul className="mt-4 list-disc space-y-2 pl-6">
                <li>Lors de la création d&apos;un compte utilisateur </li>
                <li>Lors de la connexion à l&apos;espace personnel </li>
                <li>Lors de l&apos;ajout d&apos;articles au panier </li>
                <li>Lors de la validation d&apos;une commande </li>
                <li>Lors de l&apos;utilisation du formulaire de contact </li>
                <li>
                  Lors de la navigation sur le site via les cookies autorisés.
                </li>
              </ul>
            </section>

            <section className="rounded-2xl border border-brand-muted/30 p-6">
              <h3 className="mb-3 text-xl font-bold">
                Finalités du traitement
              </h3>

              <p>
                Les données collectées sont utilisées uniquement dans le cadre
                du fonctionnement du site GreenRoots afin de :
              </p>

              <ul className="mt-4 list-disc space-y-2 pl-6">
                <li>Créer et gérer les comptes utilisateurs </li>
                <li>Permettre l&apos;authentification sécurisée</li>
                <li>Gérer les paniers et les commandes </li>
                <li>Assurer le suivi de l&apos;historique des commandes </li>
                <li>Répondre aux demandes de contact </li>
                <li>Garantir la sécurité du site et des utilisateurs </li>
                <li>Respecter les obligations légales et réglementaires.</li>
              </ul>
            </section>

            <section className="rounded-2xl border border-brand-muted/30 p-6">
              <h3 className="mb-3 text-xl font-bold">
                Base légale du traitement
              </h3>

              <p>
                Les traitements de données personnelles réalisés par GreenRoots
                reposent sur différentes bases légales prévues par le Règlement
                Général sur la Protection des Données (RGPD).
              </p>

              <ul className="mt-4 list-disc space-y-2 pl-6">
                <li>
                  <strong>Exécution d&apos;un contrat :</strong> pour la
                  création du compte utilisateur, l&apos;authentification, la
                  gestion du panier et le suivi des commandes.
                </li>

                <li>
                  <strong>Intérêt légitime :</strong> pour assurer la sécurité
                  du site, prévenir les utilisations frauduleuses et améliorer
                  les services proposés.
                </li>

                <li>
                  <strong>Obligation légale :</strong> pour respecter les
                  obligations comptables, fiscales et réglementaires
                  applicables.
                </li>

                <li>
                  <strong>Consentement :</strong> lorsque celui-ci est requis,
                  notamment pour l&apos;utilisation de certains cookies ou
                  services tiers soumis à votre accord préalable.
                </li>
              </ul>
            </section>

            <section className="rounded-2xl border border-brand-muted/30 p-6">
              <h3 className="mb-3 text-xl font-bold">
                Destinataires des données
              </h3>

              <p>
                Les données collectées sont accessibles uniquement aux membres
                habilités de l&apos;équipe GreenRoots dans le cadre du
                développement et du fonctionnement du projet.
              </p>

              <p className="mt-4">
                Elles peuvent également être traitées par les prestataires
                techniques nécessaires à l&apos;hébergement et au bon
                fonctionnement du site.
              </p>

              <p className="mt-4">
                Aucune donnée personnelle n&apos;est vendue, louée ou cédée à
                des tiers à des fins commerciales.
              </p>
            </section>

            <section className="rounded-2xl border border-brand-muted/30 p-6">
              <h3 className="mb-3 text-xl font-bold">Durée de conservation</h3>

              <p>
                Les données personnelles sont conservées uniquement pendant la
                durée nécessaire aux finalités pour lesquelles elles ont été
                collectées.
              </p>

              <ul className="mt-4 list-disc space-y-2 pl-6">
                <li>
                  Les données du compte utilisateur sont conservées tant que le
                  compte est actif.
                </li>
                <li>
                  Les données relatives aux commandes sont conservées
                  conformément aux obligations légales applicables.
                </li>
                <li>
                  Les données techniques et journaux de connexion sont conservés
                  pour une durée limitée afin d&apos;assurer la sécurité du
                  service.
                </li>
                <li>
                  Les cookies sont conservés selon leur durée de validité
                  respective.
                </li>
              </ul>
            </section>

            <section className="rounded-2xl border border-brand-muted/30 p-6">
              <h3 className="mb-3 text-xl font-bold">Sécurité des données</h3>

              <p>
                GreenRoots met en œuvre des mesures techniques et
                organisationnelles destinées à protéger les données personnelles
                contre tout accès non autorisé, perte, altération ou
                divulgation.
              </p>

              <p className="mt-4">
                Les mots de passe sont stockés sous forme chiffrée à l&apos;aide
                de l&apos;algorithme Argon2 et les échanges entre le navigateur
                et le serveur sont sécurisés via le protocole HTTPS.
              </p>
            </section>

            <section className="rounded-2xl border border-brand-muted/30 p-6">
              <h3 className="mb-3 text-xl font-bold">Cookies</h3>

              <p>
                GreenRoots utilise des cookies nécessaires au bon fonctionnement
                du site. Certains cookies peuvent être soumis à votre
                consentement préalable.
              </p>

              <p className="mt-4">
                Grâce au gestionnaire de consentement mis en place sur le site,
                vous pouvez accepter, refuser ou personnaliser
                l&apos;utilisation des cookies à tout moment.
              </p>
            </section>

            <section className="rounded-2xl border border-brand-muted/30 p-6">
              <h3 className="mb-3 text-xl font-bold">Vos droits</h3>

              <p>Conformément au RGPD, vous disposez des droits suivants :</p>

              <ul className="mt-4 list-disc space-y-2 pl-6">
                <li>Droit d&apos;accès à vos données personnelles </li>
                <li>Droit de rectification </li>
                <li>Droit à l&apos;effacement </li>
                <li>Droit à la limitation du traitement </li>
                <li>Droit d&apos;opposition </li>
                <li>Droit à la portabilité des données </li>
                <li>Droit de retirer votre consentement à tout moment</li>
              </ul>

              <p className="mt-4">
                Vous pouvez exercer ces droits en nous contactant via les
                coordonnées qui seront précisées ultérieurement.
              </p>
            </section>

            <section className="rounded-2xl border border-brand-muted/30 p-6">
              <h3 className="mb-3 text-xl font-bold">
                Réclamation auprès de la CNIL
              </h3>

              <p>
                Si vous estimez que le traitement de vos données personnelles ne
                respecte pas la réglementation en vigueur, vous pouvez
                introduire une réclamation auprès de la Commission Nationale de
                l&apos;Informatique et des Libertés (CNIL).
              </p>

              <p className="mt-4">Site officiel : www.cnil.fr</p>
            </section>

            <p className="text-sm text-brand-muted">
              Dernière mise à jour : le 04/06/2026.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

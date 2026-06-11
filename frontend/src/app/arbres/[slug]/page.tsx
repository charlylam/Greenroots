import Title from '@/components/layout/Title';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getOneTree, getTrees } from '@/lib/api';
import type { Tree } from '@/types/index';
import TreesCarousel from '@/components/layout/TreesCarousel';
import TreeQuantity from '@/components/layout/TreeQuantity';
import { cookies } from 'next/headers';
import { Metadata } from 'next';
import { getImageUrl } from '@/lib/images';

type ProjectHasTree = {
  projectId: number;
  stock: number;
  project: {
    id: number;
    slug: string;
    name: string;
  };
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tree = await getOneTree(slug);

  if (!tree) return { title: 'Arbre introuvable' };

  return {
    title: tree.commonName,
    description: tree.shortDescription,
  };
}

export default async function TreeDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [tree, treesData] = await Promise.allSettled([
    getOneTree(slug),
    getTrees(1),
  ]);

  if (tree.status === 'rejected' || !tree.value) return notFound();

  const treeData = tree.value;

  const { trees: otherTrees = [] } =
    treesData.status === 'fulfilled'
      ? treesData.value
      : (console.error(
          '[TreeDetailsPage] Erreur récupération arbres :',
          treesData.reason
        ),
        { trees: [] });

  const suggestions = (otherTrees as Tree[]).filter((t) => t.slug !== slug);

  const isLoggedIn = Boolean((await cookies()).get('token')?.value);

  const allProjects: { id: number; name: string; stock: number }[] =
    (treeData.projects as ProjectHasTree[])?.map((pt) => ({
      id: pt.project.id,
      name: pt.project.name,
      stock: pt.stock,
    })) ?? [];

  const projectsForPurchase = allProjects
    .filter((pt) => pt.stock > 0)
    .map((pt) => ({
      id: pt.id,
      slug:
        (treeData.projects as ProjectHasTree[]).find(
          (p) => p.project.id === pt.id
        )?.project.slug ?? '',
      name: pt.name,
      stock: pt.stock,
    }));

  return (
    <main>
      <Title title={treeData.commonName} />

      <section
        className="bg-brand-dark px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
        aria-label={`Fiche produit : ${treeData.commonName}`}
      >
        <div className="mx-auto max-w-7xl p-8 text-brand-white">
          <div className="flex flex-col lg:flex-row gap-12 items-stretch lg:h-[550px]">
            <div className="relative w-full lg:w-1/2 aspect-square rounded-2xl overflow-hidden bg-gray-100">
              <Image
                src={getImageUrl(treeData.picture)}
                alt={`Photo de ${treeData.commonName} (${treeData.scientificName})`}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>

            <div className="flex flex-col gap-4 lg:w-1/2 bg-brand-bg/5 rounded-2xl p-8 h-full justify-between">
              <div>
                <span className="bg-brand-accent text-white px-4 py-1 text-sm font-semibold rounded-md inline-block">
                  Origine&nbsp;: {treeData.origin}
                </span>
              </div>

              <p className="text-sm text-brand-white italic">
                Famille de produits&nbsp;: {treeData.family}
              </p>

              <div>
                <h2 className="text-3xl font-bold">{treeData.commonName}</h2>
                <p className="text-sm italic text-brand-white">
                  <span className="sr-only">Nom scientifique : </span>
                  {treeData.scientificName}
                </p>
              </div>

              <p className="text-4xl font-bold">
                <span className="sr-only">Prix : </span>
                {new Intl.NumberFormat('fr-FR', {
                  style: 'currency',
                  currency: 'EUR',
                }).format(treeData.price)}
                <span className="text-base font-normal text-brand-white">
                  {' '}
                  / arbre
                </span>
              </p>

              <p className="text-sm text-brand-white">
                Description&nbsp;:
                <br /> {treeData.shortDescription}
              </p>

              <TreeQuantity
                treeId={treeData.id}
                projects={projectsForPurchase}
                isLoggedIn={isLoggedIn}
              />

              <p className="text-xs text-brand-white">
                <span className="sr-only">Référence produit : </span>
                Réf. produit&nbsp;: {treeData.id}
              </p>
            </div>
          </div>

          <div className="mt-12 bg-brand-bg text-brand-dark rounded-2xl p-8">
            <h2 className="text-lg font-bold mb-4">
              Description &amp; caractéristiques
            </h2>
            <p className="text-sm text-muted-foreground">
              {treeData.longDescription}
            </p>
          </div>
        </div>
      </section>

      {suggestions.length > 0 && (
        <section
          className="bg-brand-bg px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
          aria-label="Autres arbres disponibles"
        >
          <div className="mx-auto max-w-7xl p-8">
            <h2 className="text-xl font-bold uppercase mb-8 text-brand-dark">
              Sélection d&apos;autres arbres
            </h2>
            <TreesCarousel trees={suggestions} />
          </div>
        </section>
      )}
    </main>
  );
}

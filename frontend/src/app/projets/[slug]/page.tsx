import { cookies } from 'next/headers';
import type { Project, Tree } from '@/types/index';
import Title from '@/components/layout/Title';
import { getOneProject, getProjectTrees } from '@/lib/api';
import TreesCarousel from '@/components/layout/TreesCarousel';
import ProjectTreePurchase from '@/components/layout/ProjectTreePurchase';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ApiError } from '@/lib/errors';
import { Metadata } from 'next';
import { getImageUrl } from '@/lib/images';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project: Project = await getOneProject(slug);

  if (!project) return { title: 'Projet introuvable' };

  return {
    title: project.name,
    description: project.shortDescription,
  };
}

type ProjectDetailPageProps = {
  params: Promise<{ slug: string }>;
};

type ApiProjectTree = {
  id: number;
  commonName: string;
  slug: string;
  scientificName: string;
  shortDescription: string;
  price: string;
  picture: string;
  stock: number;
};

type ProjectTree = Tree & {
  stock: number;
};

export default async function ProjectDetailsPage({
  params,
}: ProjectDetailPageProps) {
  const { slug } = await params;

  const isLoggedIn = Boolean((await cookies()).get('token')?.value);

  let project;

  try {
    project = await getOneProject(slug);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    } else {
      throw error;
    }
  }

  let trees: ProjectTree[] = [];

  try {
    const treesResponse = await getProjectTrees(slug, 1);
    trees = treesResponse.trees.map((tree: ApiProjectTree) => ({
      ...tree,
      price: Number(tree.price),
    }));
  } catch (error) {
    console.error('[ProjectDetailsPage] Erreur récupération arbres :', error);
    trees = [];
  }

  const {
    name,
    localisation,
    shortDescription,
    longDescription,
    progress,
    picture,
  } = project;

  return (
    <main>
      <Title title={name} />

      <section
        className="bg-brand-dark px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
        aria-label={`Fiche projet : ${name}`}
      >
        <div className="mx-auto max-w-7xl p-8 text-brand-white">
          <div className="flex flex-col items-stretch gap-12 lg:flex-row">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-100 lg:w-1/2">
              <Image
                src={getImageUrl(picture)}
                alt={`Photo du projet de reforestation : ${name}`}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>

            <div className="flex flex-col gap-6 rounded-2xl bg-brand-bg/5 p-8 lg:w-1/2">
              <div>
                <span className="inline-block rounded-md bg-brand-accent px-4 py-1 text-sm font-semibold text-white">
                  Localisation&nbsp;: {localisation}
                </span>
              </div>

              <div>
                <h2 className="text-3xl font-bold">{name}</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {shortDescription}
                </p>
              </div>

              <div
                className="max-w-4xl"
                aria-label={`Progression du projet : ${progress}% financé`}
              >
                <p className="mb-3 text-lg font-bold" aria-hidden="true">
                  {progress}% financé
                </p>

                <div
                  className="relative pr-36"
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${progress}% du projet financé`}
                >
                  <div className="relative h-16">
                    <div
                      className="absolute top-5 h-4 w-full rounded-full bg-gray-300"
                      aria-hidden="true"
                    />

                    <div
                      className="absolute top-5 h-4 rounded-full bg-brand-accent"
                      style={{ width: `${progress}%` }}
                      aria-hidden="true"
                    />

                    <Image
                      src="/images/projects/details/tree-progress.svg"
                      alt=""
                      aria-hidden="true"
                      width={40}
                      height={40}
                      className="absolute -top-2 -translate-x-1/2"
                      style={{ left: `${progress}%` }}
                    />
                  </div>

                  <div className="absolute right-5 -top-5" aria-hidden="true">
                    <Image
                      src="/images/projects/details/forest-goal.svg"
                      alt=""
                      aria-hidden="true"
                      width={110}
                      height={70}
                      className="h-auto w-[110px]"
                    />
                  </div>
                </div>

                <div
                  className="-mt-5 flex justify-between pr-36 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>

              <ProjectTreePurchase
                projectId={project.id}
                trees={trees}
                isLoggedIn={isLoggedIn}
              />
            </div>
          </div>

          <div className="mt-12 bg-brand-bg text-brand-dark rounded-2xl p-8">
            <h2 className="text-lg font-bold mb-4">Description</h2>
            <p className="text-sm text-muted-foreground">{longDescription}</p>
          </div>
        </div>
      </section>

      {trees.length > 0 && (
        <section
          className="bg-brand-bg px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
          aria-label="Arbres disponibles pour ce projet"
        >
          <div className="mx-auto max-w-7xl p-8">
            <h2 className="mb-8 text-xl font-bold uppercase text-brand-dark">
              Arbres disponibles pour ce projet
            </h2>
            <TreesCarousel trees={trees} />
          </div>
        </section>
      )}
    </main>
  );
}

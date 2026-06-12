import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import type { Tree, TreesSearchParams } from '@/types/index';
import { getTrees } from '@/lib/api';
import TreesPagination from './TreesPagination';
import TreesFilters from './TreesFilters';
import { getImageUrl } from '@/lib/images';

interface TreesContentProps {
  searchParams: TreesSearchParams;
}
export default async function TreesContent({
  searchParams,
}: TreesContentProps) {
  // Récupérer le numéro de page à partir des paramètres de recherche avec await pour s'assurer que les données sont disponibles avant de continuer
  const { page, search, minPrice, maxPrice, sortBy, sortOrder } =
    await searchParams;
  const currentPage = Number(page) || 1;
  let trees: Tree[] | null = null;
  let total = 0;
  let limit = 0;

  try {
    const treesData = await getTrees(currentPage, {
      search,
      minPrice,
      maxPrice,
      sortBy,
      sortOrder,
    });
    trees = treesData.trees;
    total = treesData.total;
    limit = treesData.limit;
  } catch (error) {
    console.error(
      'Erreur lors de la récupération des données des projets :',
      error
    );
  }

  const totalPages = Math.ceil(total / limit);
  return !trees ? (
    // Cas 1 : API injoignable
    <p className="text-center text-lg mt-10">
      Les arbres ne sont pas disponibles pour le moment.
    </p>
  ) : trees.length === 0 ? (
    // Cas 2 : recherche sans résultat
    <>
      <TreesFilters />
      <p className="text-center text-lg mt-10">
        Aucun arbre ne correspond à votre recherche.
      </p>
    </>
  ) : (
    // Cas 3 : affichage normal
    <>
      <TreesFilters />
      <div className="flex flex-row flex-wrap gap-4">
        {trees.map((tree: Tree) => (
          <Card key={tree.id} className="relative mx-auto w-full max-w-sm pt-0">
            <Badge variant="secondary" className="absolute top-2 right-2 z-40">
              {tree.origin}
            </Badge>
            <Image
              src={getImageUrl(tree.picture)}
              alt={tree.commonName}
              width={300}
              height={200}
              priority
              className="relative z-20 aspect-video w-full object-cover"
            />
            <CardHeader className="text-center">
              <CardTitle>{tree.commonName}</CardTitle>
              <CardDescription className="min-h-[3rem] italic text-center text-black">
                {tree.family}
              </CardDescription>
              <p className="text-2xl font-bold text-brand-dark text-center">
                {new Intl.NumberFormat('fr-FR', {
                  style: 'currency',
                  currency: 'EUR',
                }).format(tree.price)}
              </p>
            </CardHeader>
            <CardFooter>
              <Button className="w-full bg-accent">
                <Link href={`/arbres/${tree.slug}`} className="w-full">
                  Voir l&apos;arbre
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <TreesPagination currentPage={currentPage} totalPages={totalPages} />
    </>
  );
}

// Carte arbre utilisée dans la section "Les arbres les plus vendus" de la page d'accueil.
// Elle affiche les informations principales d'un arbre et garde le prix + bouton alignés en bas.

import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getImageUrl } from '@/lib/images';

type TreeCardProps = {
  tree: {
    id: number;
    commonName: string;
    family: string;
    origin: string;
    slug: string;
    picture: string;
    price: number;
  };
};

export default function TreeCard({ tree }: TreeCardProps) {
  return (
    <Card className="flex h-[470px] w-72 bg-brand-white pt-0 text-brand-dark transition-shadow hover:shadow-lg">
      {/* Image de l'arbre */}
      <div className="relative h-48 w-full">
        <Image
          src={getImageUrl(tree.picture)}
          alt={tree.commonName}
          fill
          sizes="288px"
          className="object-cover"
        />
      </div>

      {/* Contenu principal de la carte */}
      <CardHeader>
        <CardTitle>{tree.commonName}</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col space-y-3">
        <p className="text-sm text-black">Famille : {tree.family}</p>

        <p className="text-sm text-black">Origine : {tree.origin}</p>

        {/* Bloc fixé en bas : prix + bouton */}
        <div className="mt-auto space-y-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-brand-dark">
              {Number(tree.price).toLocaleString('fr-FR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{' '}
              €
            </p>
          </div>

          <Button
            asChild
            className="w-full bg-brand-accent !text-white hover:bg-brand-accent/80"
          >
            <Link href={`/arbres/${tree.slug}`}>Voir l&apos;arbre</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { Tree } from '@/types/index';
import { getImageUrl } from '@/lib/images';

export default function TreesCarousel({ trees }: { trees: Tree[] }) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (ref.current) {
      ref.current.scrollBy({
        left: dir === 'left' ? -320 : 320,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative">
      {/* Bouton gauche */}
      <button
        onClick={() => scroll('left')}
        aria-label="Arbres précédents"
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-brand-accent text-white flex items-center justify-center hover:opacity-80 shadow"
      >
        ‹
      </button>

      {/* Carrousel */}
      <div
        ref={ref}
        className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide px-4 sm:px-12 snap-x snap-mandatory"
      >
        {trees.map((t) => (
          <Link
            href={`/arbres/${t.slug}`}
            key={t.id}
            className="flex-shrink-0 w-64 snap-center"
          >
            <Card className="relative overflow-hidden pt-0 hover:shadow-lg transition-shadow text-center">
              <div className="relative h-48 w-full">
                <Image
                  src={getImageUrl(t.picture)}
                  alt={t.commonName}
                  fill
                  sizes="300px"
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle>{t.commonName}</CardTitle>
                <CardDescription className="italic text-black">
                  {t.family}
                </CardDescription>
                <p className="text-sm font-bold text-brand-dark">
                  {new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                  }).format(t.price)}
                </p>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      {/* Bouton droite */}
      <button
        onClick={() => scroll('right')}
        aria-label="Arbres suivants"
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-brand-accent text-white flex items-center justify-center hover:opacity-80 shadow"
      >
        ›
      </button>
    </div>
  );
}

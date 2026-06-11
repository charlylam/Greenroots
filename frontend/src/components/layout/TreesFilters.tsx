'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function TreesFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.set('page', '1');
      router.push(`/arbres?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      updateFilter('search', e.target.value);
    }, 300);
  };

  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
      {/* Filtres à gauche */}
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col gap-1">
          <Label htmlFor="search">Nom</Label>
          <Input
            id="search"
            type="text"
            placeholder="Rechercher par nom..."
            defaultValue={searchParams.get('search') ?? ''}
            onChange={handleSearch}
            className="w-60"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="minPrice">Prix min (€)</Label>
          <Input
            id="minPrice"
            type="number"
            placeholder="0"
            defaultValue={searchParams.get('minPrice') ?? ''}
            onChange={(e) => updateFilter('minPrice', e.target.value)}
            className="w-36"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="maxPrice">Prix max (€)</Label>
          <Input
            id="maxPrice"
            type="number"
            placeholder="100"
            defaultValue={searchParams.get('maxPrice') ?? ''}
            onChange={(e) => updateFilter('maxPrice', e.target.value)}
            className="w-36"
          />
        </div>
      </div>

      {/* Tri à droite */}
      <Select
        defaultValue={`${searchParams.get('sortBy') ?? 'commonName'}-${searchParams.get('sortOrder') ?? 'asc'}`}
        onValueChange={(value) => {
          const [sortBy, sortOrder] = value.split('-');
          const params = new URLSearchParams(searchParams.toString());
          params.set('sortBy', sortBy);
          params.set('sortOrder', sortOrder);
          params.set('page', '1');
          router.push(`/arbres?${params.toString()}`);
        }}
      >
        <SelectTrigger className="w-52">
          <SelectValue placeholder="Trier par..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="commonName-asc">Nom (A → Z)</SelectItem>
          <SelectItem value="commonName-desc">Nom (Z → A)</SelectItem>
          <SelectItem value="price-asc">Prix (croissant)</SelectItem>
          <SelectItem value="price-desc">Prix (décroissant)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

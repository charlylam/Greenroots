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

interface ProjectsFiltersProps {
  localisations: string[];
}

// Composant de filtres pour la page /projets
// - recherche par nom
// - filtre par localisation
// - tri par nom asc/desc
export default function ProjectsFilters({
  localisations,
}: ProjectsFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Met à jour les query params, remet la page à 1 et navigue vers /projets
  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.set('page', '1');
      router.push(`/projets?${params.toString()}`);
    },
    [router, searchParams]
  );
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Delay de 300ms pour réduire les requêtes pendant la saisie de recherche
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
      <div className="flex flex-wrap gap-4 items-end">
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
        <Select
          defaultValue={`${searchParams.get('localisation') ?? ''}`}
          onValueChange={(value) =>
            updateFilter('localisation', value === 'all' ? '' : value)
          }
        >
          <SelectTrigger className="w-52">
            <SelectValue placeholder="Filtrer par Localisation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les localisations</SelectItem>
            {localisations.map((localisation) => (
              <SelectItem key={localisation} value={localisation}>
                {localisation}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tri à droite */}
      {/* Change uniquement les paramètres de tri et réinitialise la pagination */}
      <Select
        defaultValue={`${searchParams.get('sortBy') ?? 'name'}-${searchParams.get('sortOrder') ?? 'asc'}`}
        onValueChange={(value) => {
          const [sortBy, sortOrder] = value.split('-');
          const params = new URLSearchParams(searchParams.toString());
          params.set('sortBy', sortBy);
          params.set('sortOrder', sortOrder);
          params.set('page', '1');
          router.push(`/projets?${params.toString()}`);
        }}
      >
        <SelectTrigger className="w-52">
          <SelectValue placeholder="Trier par..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name-asc">Nom (A → Z)</SelectItem>
          <SelectItem value="name-desc">Nom (Z → A)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { getImageUrl } from '@/lib/images';

interface Tree {
  id: number;
  commonName: string;
  slug: string;
  price: number;
  picture: string;
}

interface Project {
  id: number;
  name: string;
  slug: string;
  picture: string;
}

interface SearchResults {
  trees: Tree[];
  projects: Project[];
}

export default function DesktopSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults>({
    trees: [],
    projects: [],
  });

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/search?q=${encodeURIComponent(query)}`
        );

        const data = await res.json();
        setResults(data);
      } catch {
        // Ignorer les erreurs silencieusement
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  const hasResults = results.trees.length > 0 || results.projects.length > 0;

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center gap-2 w-48 border border-white/30 rounded-full px-4 py-1.5">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            const value = e.target.value;

            setQuery(value);
            setOpen(true);

            if (!value.trim()) {
              setResults({ trees: [], projects: [] });
            }
          }}
          placeholder="Rechercher..."
          className="w-full bg-transparent outline-none text-white placeholder:text-white/60 text-sm"
          autoComplete="off"
        />

        <Search className="w-5 h-5 text-white shrink-0" />
      </div>

      {open && query.trim() && (
        <div className="absolute top-full right-0 mt-1 w-80 rounded-xl bg-white shadow-xl overflow-hidden z-50">
          {hasResults ? (
            <div className="max-h-80 overflow-y-auto">
              {results.trees.length > 0 && (
                <div>
                  <p className="px-4 pt-3 pb-1 text-xs font-semibold tracking-widest text-gray-400 uppercase">
                    Arbres
                  </p>

                  {results.trees.map((tree) => (
                    <Link
                      key={tree.id}
                      href={`/arbres/${tree.slug}`}
                      onClick={() => {
                        setOpen(false);
                        setQuery('');
                        setResults({ trees: [], projects: [] });
                      }}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50"
                    >
                      <div className="w-10 h-10 relative shrink-0 bg-gray-100 rounded">
                        <Image
                          src={getImageUrl(tree.picture)}
                          alt={tree.commonName}
                          fill
                          className="object-contain"
                        />
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {tree.commonName}
                        </p>

                        <p className="text-xs text-gray-400">
                          {Number(tree.price).toFixed(2).replace('.', ',')}€
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {results.projects.length > 0 && (
                <div>
                  <p className="px-4 pt-3 pb-1 text-xs font-semibold tracking-widest text-gray-400 uppercase">
                    Projets
                  </p>

                  {results.projects.map((project) => (
                    <Link
                      key={project.id}
                      href={`/projets/${project.slug}`}
                      onClick={() => {
                        setOpen(false);
                        setQuery('');
                        setResults({ trees: [], projects: [] });
                      }}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50"
                    >
                      <div className="w-10 h-10 relative shrink-0 bg-gray-100 rounded">
                        <Image
                          src={getImageUrl(project.picture)}
                          alt={project.name}
                          fill
                          className="object-contain"
                        />
                      </div>

                      <p className="text-sm font-medium text-gray-800">
                        {project.name}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="px-4 py-3 text-sm text-gray-400">Aucun résultat</p>
          )}
        </div>
      )}
    </div>
  );
}

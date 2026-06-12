import { Skeleton } from '@/components/ui/skeleton';

export default function ProjectsSkeleton() {
  return (
    <>
      {/* Barre de filtres */}
      <div className="flex flex-wrap gap-4 mb-8">
        <Skeleton className="h-10 w-48 bg-brand-dark/10" />
        <Skeleton className="h-10 w-40 bg-brand-dark/10" />
        <Skeleton className="h-10 w-40 bg-brand-dark/10" />
      </div>

      {/* Grille de cartes */}
      <div className="flex flex-row flex-wrap gap-4 mb-8">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="relative mx-auto w-full max-w-sm overflow-hidden rounded-xl border border-brand-dark/10"
          >
            <Skeleton className="aspect-video w-full rounded-none bg-brand-dark/10" />
            <div className="space-y-4 p-6">
              <Skeleton className="h-6 w-3/4 bg-brand-dark/10" />
              <Skeleton className="h-12 w-full bg-brand-dark/10" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/3 bg-brand-dark/10" />
                <Skeleton className="h-2 w-full bg-brand-dark/10" />
              </div>
              <Skeleton className="h-10 w-full bg-brand-dark/10" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

import { Skeleton } from '../ui/skeleton';

export default function TopTreesSkeleton() {
  return (
    <section className="bg-brand-bg px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Skeleton className="mx-auto mb-10 h-8 w-80" />

        <div className="mt-10 grid justify-center gap-6 sm:grid-cols-[repeat(2,18rem)] lg:grid-cols-[repeat(4,18rem)]">
          {/* Arbre 1 */}
          <Skeleton className="h-[470px] w-72 rounded-xl bg-brand-dark/10" />
          {/* Arbre 2 */}
          <Skeleton className="h-[470px] w-72 rounded-xl bg-brand-dark/10" />
          {/* Carte entreprise */}
          <Skeleton className="h-[470px] w-72 rounded-xl bg-brand-dark/20" />
          {/* Arbre 3 */}
          <Skeleton className="h-[470px] w-72 rounded-xl bg-brand-dark/10" />
        </div>

        <div className="mt-12 text-center">
          <Skeleton className="mx-auto h-6 w-2/3" />
        </div>
      </div>
    </section>
  );
}

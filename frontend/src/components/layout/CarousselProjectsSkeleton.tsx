import { Skeleton } from '../ui/skeleton';

export default function CarouselProjectsSkeleton() {
  return (
    <section className="bg-brand-dark px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Skeleton className="mx-auto mb-10 h-8 w-96" />
        <div className="grid justify-center gap-6 sm:grid-cols-[repeat(2,18rem)] lg:grid-cols-[repeat(4,18rem)]">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[470px] w-72 rounded-xl" />
          ))}
        </div>
      </div>
    </section>
  );
}

import { Spinner } from '@/components/ui/spinner';

export default function Loading() {
  return (
    <section className="flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-center rounded-3xl p-8 text-center sm:p-10">
        <Spinner className="size-8" />
      </div>
    </section>
  );
}

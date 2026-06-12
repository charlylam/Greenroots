import Image from 'next/image';
import TopTreesSection from '@/components/home/TopTreesSection';
import ImpactSection from '@/components/home/ImpactSection';
import MissionSection from '@/components/home/MissionSection';
import CompletedProjectsSection from '@/components/home/CompletedProjectsSection';
import { ProjectsCarouselFetcher } from '@/components/home/ProjectCarousselFetcher';
import { Suspense } from 'react';
import CarouselTreesSkeleton from '@/components/layout/CarousselTreesSkeleton';
import CarouselProjectsSkeleton from '@/components/layout/CarousselProjectsSkeleton';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-brand-bg text-brand-dark">
      <section className="relative isolate min-h-[680px] overflow-hidden px-4 py-24 text-brand-white sm:px-6 lg:px-8 lg:py-28">
        <Image
          src="/images/background-image-main.jpg"
          alt="Forêt et reforestation"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/10 via-70% to-brand-dark" />
        <div className="relative mx-auto flex max-w-7xl flex-col items-center text-center pt-20">
          <h1 className="max-w-5xl text-4xl font-black uppercase leading-none tracking-tight sm:text-6xl lg:text-7xl">
            Plantez un arbre
            <br />
            avec GreenRoots
          </h1>
          <p className="mt-10 max-w-2xl text-lg font-semibold leading-7 text-brand-white sm:text-2xl">
            Choisissez un arbre, contribuez a la reforestation, suivez votre
            impact !
          </p>
        </div>
      </section>
      <Suspense fallback={<CarouselProjectsSkeleton />}>
        <ProjectsCarouselFetcher />
      </Suspense>

      <MissionSection />
      <Suspense fallback={<CarouselTreesSkeleton />}>
        <TopTreesSection />
      </Suspense>
      <CompletedProjectsSection />
      <ImpactSection />
    </main>
  );
}

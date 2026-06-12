import Image from 'next/image';

interface TitleProps {
  title: string;
}

export default function Title({ title }: TitleProps) {
  return (
    <section className="relative isolate min-h-[100px] overflow-hidden px-6 py-10 text-brand-white sm:px-6 lg:px-8 lg:py-14">
      <Image
        src="/images/background-image-main.jpg"
        alt="Forêt et reforestation"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      <div className="absolute" />
      <div className="relative mx-auto flex max-w-7xl flex-col items-center text-center pt-20">
        <h1 className="max-w-5xl text-4xl font-black uppercase leading-none tracking-tight sm:text-5xl lg:text-5xl">
          {title}
        </h1>
      </div>
    </section>
  );
}

import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';
import type { ReactNode } from 'react';

// ============================================================
// Mocks Next.js — réutilisables dans tous les tests
// ============================================================

// Mock de next/link : remplace <Link> par un simple <a>
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...rest
  }: {
    children: ReactNode;
    href: string;
    [key: string]: unknown;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

// Mock de next/navigation : router, pathname et searchParams factices
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  redirect: vi.fn(),
}));

// Mock de next/image : remplace par <img> classique (évite l'optimisation Next.js).
// On filtre les props Next.js-spécifiques (priority, fill, etc.) pour éviter
// les warnings React "non-boolean attribute".
const NEXT_IMAGE_INTERNAL_PROPS = new Set([
  'priority',
  'fill',
  'placeholder',
  'blurDataURL',
  'quality',
  'loader',
  'unoptimized',
  'sizes',
]);

vi.mock('next/image', () => ({
  default: (props: { src: string; alt: string; [key: string]: unknown }) => {
    const cleanedProps = Object.fromEntries(
      Object.entries(props).filter(
        ([key]) => !NEXT_IMAGE_INTERNAL_PROPS.has(key)
      )
    );
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...cleanedProps} src={props.src} alt={props.alt} />;
  },
}));

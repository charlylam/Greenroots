'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', {
      method: 'POST',
    });

    router.push('/authentification');
    router.refresh();
  }

  return (
    <Button
      type="button"
      onClick={handleLogout}
      className="h-12 cursor-pointer rounded-md bg-brand-accent px-6 font-semibold text-brand-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
    >
      Se déconnecter
    </Button>
  );
}

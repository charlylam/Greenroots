'use client';

export default function CookieSettingsButton() {
  return (
    <button
      type="button"
      aria-label="Gestion des cookies"
      onClick={() => window.tarteaucitron?.userInterface.openPanel()}
      className="transition-colors hover:text-brand-accent"
    >
      Gestion des cookies
    </button>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

// ============================================================
// Bouton de suppression du compte utilisateur.
// Affiche une mini-modal de confirmation pour éviter les
// suppressions accidentelles, puis appelle la route Next.js.
// ============================================================

export default function DeleteAccountButton() {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function handleConfirm() {
    setErrorMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/delete-account', {
        method: 'DELETE',
      });

      if (!response.ok) {
        setErrorMessage(
          'Erreur lors de la suppression du compte. Veuillez réessayer.'
        );
        setIsLoading(false);
        return;
      }

      // Suppression OK → on redirige vers l'accueil
      router.push('/');
      router.refresh();
    } catch {
      setErrorMessage('Impossible de contacter le serveur.');
      setIsLoading(false);
    }
  }

  return (
    <>
      {/* Bouton principal — plus petit que LogoutButton (h-12) */}
      <Button
        type="button"
        onClick={() => setIsOpen(true)}
        className="!h-9 cursor-pointer rounded-md border border-destructive bg-transparent !px-3 !text-xs font-medium text-destructive hover:bg-destructive hover:text-brand-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        Supprimer mon compte
      </Button>

      {/* Mini-modal de confirmation */}
      {isOpen && (
        <div
          // Fond semi-transparent qui ferme la modal au clic
          onClick={() => !isLoading && setIsOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-brand-dark/60 px-4 backdrop-blur-sm"
        >
          <div
            // On stoppe la propagation pour ne pas fermer en cliquant dans la modal
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-brand-white p-6 shadow-2xl"
          >
            <h3 className="text-lg font-bold text-destructive">
              Confirmer la suppression
            </h3>

            <p className="mt-3 text-sm text-brand-dark">
              Cette action est <strong>définitive</strong>. Vos données
              personnelles seront anonymisées si vous avez passé des commandes,
              ou complètement supprimées sinon. Vous ne pourrez plus vous
              connecter avec cet email.
            </p>

            {errorMessage && (
              <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                {errorMessage}
              </p>
            )}

            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
                className="h-11 cursor-pointer rounded-md border-2 border-brand-dark px-5 font-semibold text-brand-dark hover:bg-brand-dark hover:text-brand-white disabled:opacity-60"
              >
                Annuler
              </Button>

              <Button
                type="button"
                onClick={handleConfirm}
                disabled={isLoading}
                className="h-11 cursor-pointer rounded-md bg-destructive px-5 font-semibold text-brand-white hover:bg-destructive/90 disabled:opacity-60"
              >
                {isLoading ? 'Suppression…' : 'Oui, supprimer'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

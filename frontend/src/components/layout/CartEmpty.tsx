'use client';

import { useState } from 'react';
import { clearCartAction } from '@/lib/actions/cart';
import { Button } from '../ui/button';
import { useCart } from '@/components/cart/CartProvider';

// Bloc d'action utilisé pour vider complètement le panier.
// Le composant gère une confirmation avant suppression afin d'éviter
// qu'un clic accidentel ne vide immédiatement le panier de l'utilisateur.
export default function CartEmpty() {
  // État local qui contrôle l'affichage de la confirmation.
  // Tant qu'il est à `false`, seul le bouton principal est visible.
  const [isConfirming, setIsConfirming] = useState(false);

  // Fonction globale de rafraîchissement du panier fournie par le contexte.
  // Elle permet de remettre immédiatement l'interface à jour après la suppression.
  const { refreshCart } = useCart();

  // Exécute la suppression complète du panier.
  // L'action serveur vide le panier côté backend, puis on recharge les données
  // pour synchroniser le compteur et l'état affiché dans l'application.
  async function handleClear() {
    await clearCartAction();
    await refreshCart();

    // Une fois l'opération terminée, on referme le panneau de confirmation
    // pour revenir à l'état normal de l'interface.
    setIsConfirming(false);
  }

  return (
    // aria-live="polite" + aria-atomic="true" : les lecteurs d'écran annoncent
    // le changement d'état quand la zone de confirmation apparaît ou disparaît,
    // sans interrompre une lecture en cours.
    <div aria-live="polite" aria-atomic="true">
      {!isConfirming ? (
        // Bouton principal : il n'efface rien immédiatement, il ouvre d'abord
        // une confirmation explicite pour sécuriser l'action.
        // aria-expanded indique aux lecteurs d'écran si la confirmation est ouverte.
        <Button
          onClick={() => setIsConfirming(true)}
          variant="outline"
          className="bg-brand-white"
          aria-expanded={isConfirming}
        >
          Vider le panier
        </Button>
      ) : (
        // role="group" + aria-label : regroupe sémantiquement les deux boutons
        // et contextualise l'action pour les lecteurs d'écran.
        <div
          role="group"
          aria-label="Confirmer la suppression du panier"
          className="flex gap-4"
        >
          {/* Texte sr-only lu avant les boutons : contextualise l'action
              pour les utilisateurs de lecteurs d'écran qui ne voient pas
              le bouton "Vider le panier" qui a déclenché cette confirmation. */}
          <p className="sr-only">
            Voulez-vous vraiment vider votre panier ? Cette action est
            irréversible.
          </p>

          {/* Bouton de validation : déclenche réellement la suppression du panier.
              aria-label explicite car "Valider" seul est ambigu hors contexte visuel. */}
          <Button
            onClick={handleClear}
            variant="destructive"
            className="bg-brand-white"
            aria-label="Confirmer — vider définitivement le panier"
          >
            Valider
          </Button>

          {/* Bouton d'annulation : ferme simplement la confirmation sans rien modifier.
              aria-label explicite pour la même raison qu'"Annuler" seul manque de contexte. */}
          <Button
            onClick={() => setIsConfirming(false)}
            variant="outline"
            className="bg-brand-white"
            aria-label="Annuler — conserver le panier"
          >
            Annuler
          </Button>
        </div>
      )}
    </div>
  );
}

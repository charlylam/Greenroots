'use client';

import { useState } from 'react';
import { changeQuantityAction } from '@/lib/actions/cart';
import { useCart } from '@/components/cart/CartProvider';

// Contrôle de quantité affiché à côté d'une ligne du panier.
// Le composant gère la diminution, l'augmentation et l'affichage d'une erreur
// si le backend refuse la modification.
export default function CartItemQuantity({
  cartItemId,
  quantity,
}: {
  cartItemId: number;
  quantity: number;
}) {
  // Message d'erreur local affiché uniquement pour cette ligne de panier.
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fonction de rafraîchissement globale du panier.
  // Elle permet de synchroniser immédiatement le compteur et les données affichées
  // après une modification de quantité.
  const { refreshCart } = useCart();

  // Une seule fonction gère les deux boutons de quantité.
  // On lui transmet la nouvelle valeur souhaitée pour éviter de dupliquer la logique.
  async function handleChange(newQuantity: number) {
    // On réinitialise l'erreur avant chaque tentative pour repartir sur un état propre.
    setErrorMessage(null);

    // Appel à l'action serveur responsable de la mise à jour de la quantité.
    const result = await changeQuantityAction(cartItemId, newQuantity);

    // Si le backend refuse la modification, on affiche le message retourné
    // pour donner un retour direct à l'utilisateur.
    if (!result.ok) {
      setErrorMessage(result.message);
    }

    // Après la tentative de mise à jour, on recharge le panier pour refléter
    // les données réellement enregistrées côté serveur.
    await refreshCart();
  }

  return (
    <div className="flex flex-col gap-1">
      {/* Groupe de boutons permettant de diminuer ou d'augmenter la quantité. */}
      <div className="flex items-center gap-2">
        <button
          aria-label="Diminuer la quantité"
          onClick={() => handleChange(quantity - 1)}
          disabled={quantity <= 1}
          className="w-8 h-8 rounded-full bg-brand-accent text-white flex items-center justify-center hover:opacity-80 disabled:opacity-40"
        >
          {/* Bouton de diminution : il est désactivé lorsqu'on atteint la quantité minimale. */}
          −
        </button>

        {/* Quantité actuellement sélectionnée pour cet article. */}
        <span className="w-8 h-8 border flex items-center justify-center text-sm font-semibold">
          {quantity}
        </span>

        {/* Bouton d'augmentation : il réutilise la même logique de mise à jour. */}
        <button
          aria-label="Augmenter la quantité"
          onClick={() => handleChange(quantity + 1)}
          className="w-8 h-8 rounded-full bg-brand-accent text-white flex items-center justify-center hover:opacity-80"
        >
          {/* Ajout d'une unité à la quantité actuelle. */}+
        </button>
      </div>

      {/* Message d'erreur contextuel si la mise à jour a échoué. */}
      {errorMessage && <p className="text-xs text-red-600">{errorMessage}</p>}
    </div>
  );
}

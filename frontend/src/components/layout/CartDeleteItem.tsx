'use client';

import { deleteItemAction } from '@/lib/actions/cart';
import { Trash } from 'lucide-react';
import { useCart } from '@/components/cart/CartProvider';

// Petit bouton d'action utilisé dans le panier pour supprimer une ligne produit.
// Le composant reste volontairement minimal : il déclenche la suppression côté serveur
// puis demande au contexte panier de se rafraîchir afin de synchroniser l'affichage.
export default function CartDeleteItem({ cartItemId }: { cartItemId: number }) {
  // On récupère la fonction globale de rafraîchissement du panier via le contexte partagé.
  const { refreshCart } = useCart();

  // Gestion du clic sur l'icône de suppression.
  // La suppression est réalisée via une server action, puis le panier est rechargé
  // uniquement si l'opération a bien réussi.
  async function handleClear() {
    const result = await deleteItemAction(cartItemId);

    // Si la suppression échoue, on ne met pas à jour le panier pour éviter
    // d'afficher un état incohérent à l'utilisateur.
    if (!result.ok) {
      return;
    }

    // Après suppression réussie, on redemande les données du panier au backend
    // pour mettre à jour les totaux et les badges d'interface.
    await refreshCart();
  }

  return (
    // Bouton visuel compact, pensé pour être utilisé directement à côté d'une ligne panier.
    <button
      aria-label="Supprimer du panier"
      onClick={handleClear}
      className="text-brand-dark hover:text-red-600 p-2 rounded-full bg-white/80 p-2 hover:bg-white shadow-md "
    >
      {/* Icône de corbeille utilisée comme repère visuel pour la suppression. */}
      <Trash size={20} />
    </button>
  );
}

'use server';

import {
  addToCart,
  changeCartItemQuantity,
  clearCart,
  createOrder,
  deleteCartItem,
} from '@/lib/api';
import { ApiError } from '@/lib/errors';
import { revalidatePath } from 'next/cache';

/*
 * Actions serveur pour les mutations du panier.
 * - Exécutées côté serveur (`use server`).
 * - Elles délèguent aux helpers de `@/lib/api` qui réalisent les requêtes HTTP.
 * - Après chaque mutation, on appelle `revalidatePath('/panier')` pour invalider le cache de la page panier.
 * - Plutôt que de jeter des erreurs, ces fonctions retournent un `ActionResult` exploitable côté client
 *   (simplifie la gestion d'erreurs dans l'UI et évite les erreurs serveur non traitées).
 */

// Format returned to client components: either success or an error message
// Format retourné aux composants clients : succès ou message d'erreur
type ActionResult = { ok: true } | { ok: false; message: string };
type OrderActionResult =
  | { ok: true; orderId: number }
  | { ok: false; message: string };

/**
 * Modifie la quantité d'un item du panier.
 * - `cartItemId` : identifiant du `cartItem` à mettre à jour.
 * - `quantity` : nouvelle quantité absolue (la validation du stock est faite côté serveur).
 * - Effet secondaire : réinvalide `/panier` pour que l'UI affiche les totaux/ligne mis à jour.
 */
export async function changeQuantityAction(
  cartItemId: number,
  quantity: number
): Promise<ActionResult> {
  try {
    await changeCartItemQuantity(cartItemId, quantity);
    revalidatePath('/panier');
    return { ok: true };
  } catch (error) {
    if (error instanceof ApiError) {
      // ApiError.message peut être affiché à l'utilisateur (message préparé côté backend)
      return { ok: false, message: error.message };
    }
    return { ok: false, message: 'Une erreur est survenue' };
  }
}

/**
 * Vide le panier actif de l'utilisateur.
 * - Pas de paramètres. Utile pour l'action "vider le panier".
 */
export async function clearCartAction(): Promise<ActionResult> {
  try {
    await clearCart();
    revalidatePath('/panier');
    return { ok: true };
  } catch (error) {
    if (error instanceof ApiError) {
      return { ok: false, message: error.message };
    }
    return { ok: false, message: 'Une erreur est survenue' };
  }
}

/**
 * Supprime un seul item du panier.
 * - `cartItemId` : identifiant de la ligne à supprimer.
 */
export async function deleteItemAction(
  cartItemId: number
): Promise<ActionResult> {
  try {
    await deleteCartItem(cartItemId);
    revalidatePath('/panier');
    return { ok: true };
  } catch (error) {
    if (error instanceof ApiError) {
      return { ok: false, message: error.message };
    }
    return { ok: false, message: 'Une erreur est survenue' };
  }
}

/**
 * Ajoute un arbre au panier actif pour un projet.
 * - `treeId` : identifiant de l'arbre à ajouter.
 * - `projectId` : identifiant du projet où l'arbre est vendu.
 * - `quantity` : nombre de plants à ajouter (validation du stock côté serveur).
 * - Retourne un `ActionResult` que les composants clients peuvent utiliser pour afficher succès/erreur.
 */
export async function addToCartAction(
  treeId: number,
  projectId: number,
  quantity: number
): Promise<ActionResult> {
  try {
    await addToCart(treeId, projectId, quantity);
    // Pas de revalidatePath ici — il démonte le modal avant l'affichage
    // de la confirmation. La page panier sera rafraîchie via router.refresh()
    // au moment de la redirection vers l'espace client.
    return { ok: true };
  } catch (error) {
    if (error instanceof ApiError) {
      return { ok: false, message: error.message };
    }
    return { ok: false, message: 'Une erreur est survenue' };
  }
}

export async function createOrderAction(): Promise<OrderActionResult> {
  try {
    const { data: order } = await createOrder();
    revalidatePath('/panier');
    return { ok: true, orderId: order.id };
  } catch (error) {
    if (error instanceof ApiError) {
      return { ok: false, message: error.message };
    }
    return { ok: false, message: 'Une erreur est survenue' };
  }
}

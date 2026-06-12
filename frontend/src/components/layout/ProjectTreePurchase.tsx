'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { addToCartAction } from '@/lib/actions/cart';
import Link from 'next/link';
import { useCart } from '@/components/cart/CartProvider';

// Type local décrivant les arbres disponibles à l'achat pour un projet.
// Il regroupe les informations nécessaires au rendu et à l'ajout au panier,
// sans exposer de données métier inutiles pour ce composant.
type ProjectTree = {
  id: number;
  slug: string;
  commonName: string;
  price: number;
  stock: number;
};

type ProjectTreePurchaseProps = {
  projectId: number;
  trees: ProjectTree[];
  isLoggedIn: boolean;
};

export default function ProjectTreePurchase({
  projectId,
  trees,
  isLoggedIn,
}: ProjectTreePurchaseProps) {
  // useTransition permet de marquer l’ajout au panier comme une action non urgente.
  // isPending indique que la transition est en cours, ce qui permet de désactiver
  // le bouton et d’afficher un état de chargement sans bloquer le rendu immédiat.
  const [isPending, startTransition] = useTransition();

  // État courant de l'arbre sélectionné dans la liste déroulante.
  const [selectedTreeId, setSelectedTreeId] = useState(trees[0]?.id ?? 0);

  // Quantité demandée pour l’ajout au panier.
  const [quantity, setQuantity] = useState(1);

  // Message affiché à l’utilisateur après une tentative d’ajout.
  const [message, setMessage] = useState('');

  // Fonction globale qui permet de remettre à jour le badge panier après un ajout.
  const { refreshCart } = useCart();

  // Arbre actuellement sélectionné, calculé à partir de l’état ci-dessus.
  const selectedTree = trees.find((tree) => tree.id === selectedTreeId);

  // Handler principal pour ajouter un arbre au panier.
  // 1. il réinitialise le message avant de lancer la vérification,
  // 2. il bloque l’action si l’utilisateur n’est pas connecté,
  // 3. il contrôle que l’arbre choisi existe bien,
  // 4. il appelle la Server Action d'ajout au panier
  // 5. il affiche un message de succès ou d’échec selon la réponse serveur.

  function handleAddToCart() {
    // L’ajout au panier est lancé dans une transition
    //  pour obtenir l'état isPending et ne pas bloquer l'interface pendant l'appel serveur
    startTransition(async () => {
      // On efface le message précédent avant de traiter une nouvelle tentative.
      setMessage('');
      if (!isLoggedIn) {
        // Un utilisateur non connecté doit d'abord s'authentifier avant d'ajouter un arbre.
        setMessage('Connectez-vous pour ajouter un arbre au panier.');
        return;
      }

      if (!selectedTree) {
        // Sécurité supplémentaire si aucune option valide n'est disponible.
        setMessage('Veuillez choisir un arbre.');
        return;
      }

      // Appelle l'action serveur pour ajouter l'arbre sélectionné au panier
      const response = await addToCartAction(
        selectedTree.id,
        projectId,
        quantity
      );

      if (!response.ok) {
        setMessage(response.message);
        return;
      }

      // Une fois l'ajout confirmé par le backend, on synchronise l'interface
      // avec les nouvelles données du panier.
      await refreshCart();
      setMessage('Arbre ajouté au panier.');
    });
  }

  return (
    <div className="flex flex-col gap-4 border-t border-brand-accent/30 pt-6">
      <h3 className="text-xl font-bold">Participer à ce projet</h3>

      <div className="flex flex-col gap-2">
        {/* Sélecteur principal permettant de choisir l’arbre à acheter. */}
        <label htmlFor="project-tree" className="text-sm">
          Choisir un arbre
        </label>

        <select
          id="project-tree"
          value={selectedTreeId}
          onChange={(event) => {
            // Quand l’utilisateur change d’arbre, on remet la quantité à 1
            // et on efface l’ancien message pour éviter toute confusion.
            setSelectedTreeId(Number(event.target.value));
            setQuantity(1);
            setMessage('');
          }}
          className="w-full rounded-md bg-brand-bg px-3 py-2 text-sm text-brand-dark"
        >
          {trees.map((tree) => (
            <option key={tree.id} value={tree.id}>
              {tree.commonName} — {Number(tree.price).toFixed(2)} €
            </option>
          ))}
        </select>
      </div>

      {/* Affichage conditionnel du détail de l’arbre sélectionné. */}
      {selectedTree && (
        <>
          {/* Prix affiché en grand pour rendre l'information d'achat immédiatement visible. */}
          <p className="text-3xl font-bold">
            {Number(selectedTree.price).toFixed(2)} €
            <span className="text-base font-normal text-muted-foreground">
              {' '}
              / arbre
            </span>
          </p>

          {/* Rappel de disponibilité du stock pour éviter les commandes impossibles. */}
          <p className="text-sm">
            <span className="mr-2 rounded border border-brand-accent px-2 py-0.5 text-xs font-semibold text-brand-accent">
              En stock
            </span>
            <span className="text-muted-foreground">
              {selectedTree.stock} plants disponibles
            </span>
          </p>
        </>
      )}

      {/* Groupe d'actions principal : réglage de quantité puis ajout au panier. */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Contrôles de quantité : augmentation, diminution et limite selon le stock. */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Diminuer la quantité"
            disabled={!isLoggedIn}
            // Le bouton moins réduit la quantité à 1 minimum.
            // Il reste désactivé si l’utilisateur n’est pas connecté.
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-accent text-white hover:opacity-80 disabled:pointer-events-none disabled:opacity-50"
          >
            −
          </button>

          <span className="flex h-8 w-8 items-center justify-center border text-sm font-semibold">
            {quantity}
          </span>

          <button
            type="button"
            aria-label="Augmenter la quantité"
            disabled={
              !isLoggedIn ||
              (selectedTree ? quantity >= selectedTree.stock : true)
            }
            // Le bouton plus augmente la quantité, mais jamais au-delà du stock disponible.
            // Il est désactivé si l’utilisateur n’est pas connecté ou si le stock est atteint.
            onClick={() =>
              setQuantity((value) =>
                selectedTree
                  ? Math.min(selectedTree.stock, value + 1)
                  : value + 1
              )
            }
            className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-accent text-white hover:opacity-80 disabled:pointer-events-none disabled:opacity-50"
          >
            +
          </button>
        </div>

        <Button
          type="button"
          onClick={handleAddToCart}
          // Le bouton d’ajout est verrouillé tant que l’utilisateur n’est pas connecté
          // ou qu’aucun arbre valide n’est disponible à l’achat.
          disabled={
            !isLoggedIn || !selectedTree || selectedTree.stock <= 0 || isPending
          }
          title={
            !isLoggedIn ? 'Connectez-vous pour ajouter au panier' : undefined
          }
          className="bg-brand-accent px-6 text-white disabled:pointer-events-none disabled:opacity-50"
        >
          {isPending ? 'Ajout...' : '🛒 Ajouter au panier'}
        </Button>
      </div>

      {/* Message d’aide affiché uniquement si l’utilisateur n’est pas connecté. */}
      {!isLoggedIn && (
        <p className="text-sm text-muted-foreground">
          Connectez-vous pour choisir une quantité et ajouter un arbre au
          panier.
        </p>
      )}

      {/* Message de retour utilisateur affiché après la tentative d’ajout au panier. */}
      {message && <p className="text-sm">{message}</p>}

      {/* Lien vers la fiche détaillée de l’arbre sélectionné. */}
      {selectedTree && (
        <Link
          href={`/arbres/${selectedTree.slug}`}
          className="text-sm text-brand-accent underline-offset-4 hover:underline"
        >
          Voir la fiche complète →
        </Link>
      )}
    </div>
  );
}

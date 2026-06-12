'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { addToCartAction } from '@/lib/actions/cart';
import { useCart } from '@/components/cart/CartProvider';

// Type d'un projet auquel cet arbre peut être planté.
type ProjectOption = {
  id: number;
  slug: string;
  name: string;
  stock: number;
};

type TreeQuantityProps = {
  treeId: number;
  projects: ProjectOption[];
  isLoggedIn: boolean;
};

/**
 * Sélecteur de projet + quantité + bouton d'ajout au panier
 * affiché sur la fiche détail d'un arbre.
 *
 * Symétrique de ProjectTreePurchase (côté projet) :
 * - ProjectTreePurchase = un projet, choix d'arbre
 * - TreeQuantity        = un arbre,  choix de projet
 */
export default function TreeQuantity({
  treeId,
  projects,
  isLoggedIn,
}: TreeQuantityProps) {
  const [selectedProjectId, setSelectedProjectId] = useState(
    projects[0]?.id ?? 0
  );
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const [isPending, setIsPending] = useState(false);
  const { refreshCart } = useCart();

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  async function handleAddToCart() {
    setMessage('');

    if (!isLoggedIn) {
      setMessage('Connectez-vous pour ajouter un arbre au panier.');
      return;
    }
    if (!selectedProject) {
      setMessage('Veuillez choisir un projet.');
      return;
    }

    setIsPending(true);
    const response = await addToCartAction(
      treeId,
      selectedProject.id,
      quantity
    );
    setIsPending(false);

    if (!response.ok) {
      setMessage(response.message);
      return;
    }
    await refreshCart();
    setMessage('Arbre ajouté au panier ✅');
  }

  return (
    <div className="flex flex-col gap-3 mt-2">
      {/* Sélecteur de projet */}
      <div className="flex flex-col gap-1 w-full min-w-0">
        <label htmlFor="project-select" className="text-sm">
          Choisir le projet
        </label>
        <select
          id="project-select"
          value={selectedProjectId}
          onChange={(e) => {
            setSelectedProjectId(Number(e.target.value));
            setQuantity(1);
            setMessage('');
          }}
          className="bg-brand-bg text-brand-dark px-2 py-1 text-sm rounded-md border-0 w-full max-w-full min-w-0 truncate"
        >
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.stock} disponibles)
            </option>
          ))}
        </select>
      </div>

      {/* Quantité + bouton */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Diminuer la quantité"
            disabled={!isLoggedIn || isPending}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-8 h-8 rounded-full bg-brand-accent text-white flex items-center justify-center hover:opacity-80 disabled:opacity-50"
          >
            −
          </button>
          <span className="w-8 h-8 border flex items-center justify-center text-sm font-semibold">
            {quantity}
          </span>
          <button
            type="button"
            aria-label="Augmenter la quantité"
            disabled={
              !isLoggedIn ||
              isPending ||
              (selectedProject ? quantity >= selectedProject.stock : true)
            }
            onClick={() =>
              setQuantity((q) =>
                selectedProject ? Math.min(selectedProject.stock, q + 1) : q + 1
              )
            }
            className="w-8 h-8 rounded-full bg-brand-accent text-white flex items-center justify-center hover:opacity-80 disabled:opacity-50"
          >
            +
          </button>
        </div>

        <Button
          type="button"
          onClick={handleAddToCart}
          disabled={
            !isLoggedIn ||
            isPending ||
            !selectedProject ||
            selectedProject.stock <= 0
          }
          title={
            !isLoggedIn ? 'Connectez-vous pour ajouter au panier' : undefined
          }
          className="bg-brand-accent text-white px-6 disabled:opacity-50"
        >
          {isPending
            ? 'Ajout…'
            : `🛒 Planter ${quantity} arbre${quantity > 1 ? 's' : ''}`}
        </Button>
      </div>

      {message && <p className="text-sm">{message}</p>}
    </div>
  );
}

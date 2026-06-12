'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

// Type partagé par tout le panier côté front.
// Il expose uniquement la quantité totale d'articles et une méthode pour
// recharger cette valeur depuis l'API, afin que les composants consommateurs
// n'aient pas à connaître les détails de récupération des données.
type CartContextType = {
  cartCount: number;
  refreshCart: () => Promise<void>;
};

// Contexte global utilisé pour partager l'état du panier dans l'application.
// La valeur reste `null` tant que le provider n'a pas été monté.
const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({
  children,
  isLoggedIn,
}: {
  children: ReactNode;
  isLoggedIn: boolean;
}) {
  // Nombre total d'articles dans le panier.
  // Il est stocké au niveau du provider pour être accessible depuis n'importe quel écran.
  const [cartCount, setCartCount] = useState(0);

  // Recharge le panier depuis le backend.
  // Cette fonction centralise toute la logique de synchronisation entre le front
  // et l'API afin que les composants puissent simplement l'appeler après une action
  // qui modifie le panier (ajout, suppression, changement de quantité, etc.).
  const refreshCart = useCallback(async () => {
    // Si l'utilisateur n'est pas connecté, on force le compteur à zéro.
    // Cela évite d'afficher un ancien état de panier pour une session non authentifiée.
    if (!isLoggedIn) {
      setCartCount(0);
      return;
    }

    try {
      // Appel à l'API des paniers.
      // Le cookie de session doit être envoyé pour que le backend puisse
      // identifier l'utilisateur et renvoyer son panier actif.
      const response = await fetch('/api/cart');

      // En cas d'erreur HTTP, on préfère afficher zéro plutôt que conserver
      // une donnée potentiellement obsolète ou incohérente.
      if (!response.ok) {
        setCartCount(0);
        return;
      }

      // Le backend renvoie un objet contenant les données du panier.
      const result = await response.json();

      // Le compteur affiché dans l'interface correspond au total des quantités,
      // pas au nombre de lignes du panier. On additionne donc les `quantity`
      // de chaque article pour obtenir la valeur réellement attendue par l'UI.
      const count =
        result.data?.items?.reduce(
          (total: number, item: { quantity: number }) => total + item.quantity,
          0
        ) ?? 0;

      setCartCount(count);
    } catch {
      // En cas de problème réseau ou d'exception inattendue,
      // on retombe sur un état neutre pour éviter d'afficher un faux total.
      setCartCount(0);
    }
  }, [isLoggedIn]);

  // Recharge automatiquement le panier au montage du provider
  // et à chaque fois que l'état de connexion change.
  useEffect(() => {
    async function loadCart() {
      await refreshCart();
    }

    // `void` indique volontairement qu'on déclenche une promesse sans attendre
    // sa résolution directement dans l'effet.
    void loadCart();
  }, [refreshCart]);

  return (
    // Le provider expose à toute l'application le compteur du panier
    // et la fonction de rafraîchissement associée.
    <CartContext.Provider value={{ cartCount, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

// Hook dédié pour consommer le contexte panier sans répéter la logique d'accès.
// Il garantit aussi qu'aucun composant n'utilise le contexte en dehors du provider.
export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    // Erreur de configuration claire si un composant tente d'utiliser le panier
    // sans être enveloppé par `CartProvider`.
    throw new Error('useCart doit être utilisé dans un CartProvider');
  }

  return context;
}

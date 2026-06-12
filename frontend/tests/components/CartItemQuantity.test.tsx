// ============================================================
// IMPORTS
// ============================================================

// Les outils de test fournis par @testing-library/react :
// - render   : monte le composant React en mémoire (pas de vrai navigateur)
// - screen   : permet de chercher des éléments dans ce qui est rendu
// - fireEvent: simule des actions utilisateur (clic, frappe clavier...)
// - waitFor  : attend qu'une condition async soit vraie avant de vérifier
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Les outils de test fournis par vitest :
// - describe : regroupe plusieurs tests liés au même composant
// - it       : déclare un test individuel
// - expect   : fait une assertion ("je m'attends à ce que...")
// - vi       : utilitaire pour créer des mocks (fausses fonctions)
// - beforeEach : code qui s'exécute automatiquement AVANT chaque test
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Le composant qu'on veut tester
import CartItemQuantity from '@/components/layout/CartItemQuantity';

// La fonction qui envoie la modification de quantité au serveur.
// On va la "mocker" pour ne pas faire de vrais appels réseau pendant les tests.
import { changeQuantityAction } from '@/lib/actions/cart';

// Le hook qui donne accès au contexte du panier (refreshCart, etc.)
// On va aussi le mocker pour ne pas avoir besoin du vrai Provider React.
import { useCart } from '@/components/cart/CartProvider';

// ============================================================
// MOCKS — "fausses" versions des dépendances
// ============================================================

// vi.mock() remplace tout le module par des fonctions vides automatiquement.
// Résultat : pendant les tests, changeQuantityAction ne fait RIEN
// tant qu'on ne lui dit pas quoi retourner.
// Pourquoi ? Pour tester UNIQUEMENT le composant, pas le serveur.
vi.mock('@/lib/actions/cart');

// Même chose pour useCart : on ne veut pas monter tout le vrai Context React.
// On va juste lui dire "retourne cet objet" dans chaque test.
vi.mock('@/components/cart/CartProvider');

// On crée une fausse fonction refreshCart.
// vi.fn() = fonction vide qui enregistre si elle a été appelée, combien de fois, avec quels args.
// <() => Promise<void>> = son type TypeScript (elle retourne une Promise qui ne renvoie rien).
// .mockResolvedValue(undefined) = quand elle est appelée, elle retourne une Promise résolue.
const mockRefreshCart = vi
  .fn<() => Promise<void>>()
  .mockResolvedValue(undefined);

// ============================================================
// beforeEach — s'exécute avant CHAQUE test du describe
// ============================================================

beforeEach(() => {
  // Remet tous les mocks à zéro : compteurs d'appels, valeurs retournées, etc.
  // Sans ça, un test pourrait être influencé par ce qu'a fait le test précédent.
  vi.clearAllMocks();

  // On dit à useCart (qui est mocké) ce qu'il doit retourner quand le composant l'appelle.
  // Le vrai useCart retourne { refreshCart, ... }, on reproduit la même forme.
  vi.mocked(useCart).mockReturnValue({ refreshCart: mockRefreshCart });
});

// ============================================================
// TESTS
// ============================================================

// describe = "boîte" qui regroupe tous les tests du composant CartItemQuantity
describe('CartItemQuantity', () => {
  // TEST 1 : le composant affiche-t-il bien la quantité qu'on lui passe ?
  it('affiche la quantité actuelle', () => {
    // On monte le composant avec quantity=3
    render(<CartItemQuantity cartItemId={1} quantity={3} />);

    // On vérifie que le chiffre "3" est visible quelque part dans le rendu
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  // TEST 2 : le bouton "−" doit être désactivé quand on est déjà à 1
  // (règle métier : on ne peut pas commander 0 article)
  it('le bouton diminuer est désactivé si quantity = 1', () => {
    render(<CartItemQuantity cartItemId={1} quantity={1} />);

    // getByRole('button', { name: /diminuer/i }) cherche un <button>
    // dont le texte accessible contient "diminuer" (insensible à la casse).
    // Ici c'est l'aria-label="Diminuer la quantité" qui est lu.
    expect(screen.getByRole('button', { name: /diminuer/i })).toBeDisabled();
  });

  // TEST 3 : cliquer sur "−" doit appeler changeQuantityAction avec quantity - 1
  it('appelle changeQuantityAction avec quantity - 1 au clic sur diminuer', async () => {
    // On dit à changeQuantityAction (mockée) de retourner { ok: true }
    // quand elle sera appelée dans ce test.
    vi.mocked(changeQuantityAction).mockResolvedValue({ ok: true });

    // On monte le composant avec quantity=3
    render(<CartItemQuantity cartItemId={1} quantity={3} />);

    // On simule un clic sur le bouton "−"
    fireEvent.click(screen.getByRole('button', { name: /diminuer/i }));

    // handleChange est async, donc on utilise waitFor :
    // "attends que cette assertion devienne vraie"
    await waitFor(() => {
      // On vérifie que changeQuantityAction a été appelée avec les bons arguments :
      // cartItemId=1 et newQuantity=2 (3 - 1)
      expect(changeQuantityAction).toHaveBeenCalledWith(1, 2);
    });
  });

  // TEST 4 : si le backend retourne ok:false, le message d'erreur doit s'afficher
  it("affiche un message d'erreur si le backend refuse", async () => {
    // Cette fois on simule un refus du serveur
    vi.mocked(changeQuantityAction).mockResolvedValue({
      ok: false,
      message: 'Stock insuffisant',
    });

    render(<CartItemQuantity cartItemId={1} quantity={3} />);

    // On clique sur "+" pour déclencher handleChange
    fireEvent.click(screen.getByRole('button', { name: /augmenter/i }));

    // On attend que le message d'erreur apparaisse dans le DOM
    await waitFor(() => {
      expect(screen.getByText('Stock insuffisant')).toBeInTheDocument();
    });
  });

  // TEST 5 : refreshCart doit toujours être appelé après la tentative,
  // qu'elle ait réussi ou échoué
  it('appelle refreshCart après la mise à jour', async () => {
    vi.mocked(changeQuantityAction).mockResolvedValue({ ok: true });

    render(<CartItemQuantity cartItemId={1} quantity={2} />);
    fireEvent.click(screen.getByRole('button', { name: /augmenter/i }));

    await waitFor(() => {
      // toHaveBeenCalled() vérifie juste que la fonction a été appelée au moins une fois
      expect(mockRefreshCart).toHaveBeenCalled();
    });
  });
});

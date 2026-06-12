import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LogoutButton from '@/components/layout/LogoutButton';

// ============================================================
// MOCKS
// ============================================================

// On mock next/navigation pour contrôler router.push et router.refresh
// sans avoir besoin d'un vrai routeur Next.js
const mockPush = vi.fn();
const mockRefresh = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}));

// On mock fetch (disponible globalement dans le navigateur/Node)
// pour ne pas faire de vrais appels réseau
global.fetch = vi.fn();

// ============================================================
// RESET
// ============================================================

beforeEach(() => {
  vi.clearAllMocks();
});

// ============================================================
// TESTS
// ============================================================

describe('LogoutButton', () => {
  // TEST 1 : le bouton est-il bien affiché avec le bon texte ?
  it('affiche le bouton "Se déconnecter"', () => {
    render(<LogoutButton />);
    expect(
      screen.getByRole('button', { name: /se déconnecter/i })
    ).toBeInTheDocument();
  });

  // TEST 2 : au clic, appelle-t-il bien la bonne route API en POST ?
  it('appelle /api/auth/logout en POST au clic', async () => {
    // On dit à fetch de simuler une réponse OK
    vi.mocked(global.fetch).mockResolvedValue(
      new Response(null, { status: 200 })
    );

    render(<LogoutButton />);
    fireEvent.click(screen.getByRole('button', { name: /se déconnecter/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/auth/logout', {
        method: 'POST',
      });
    });
  });

  // TEST 3 : après la déconnexion, redirige-t-il vers /authentification ?
  it('redirige vers /authentification après la déconnexion', async () => {
    vi.mocked(global.fetch).mockResolvedValue(
      new Response(null, { status: 200 })
    );

    render(<LogoutButton />);
    fireEvent.click(screen.getByRole('button', { name: /se déconnecter/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/authentification');
    });
  });

  // TEST 4 : router.refresh() est-il bien appelé après la redirection ?
  // (nécessaire pour vider le cache Next.js et forcer le rechargement des Server Components)
  it('appelle router.refresh() après la redirection', async () => {
    vi.mocked(global.fetch).mockResolvedValue(
      new Response(null, { status: 200 })
    );

    render(<LogoutButton />);
    fireEvent.click(screen.getByRole('button', { name: /se déconnecter/i }));

    await waitFor(() => {
      expect(mockRefresh).toHaveBeenCalled();
    });
  });
});

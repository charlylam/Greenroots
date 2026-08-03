import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Header from '@/components/layout/Header';
import { CartProvider } from '@/components/cart/CartProvider';
// Les mocks next/link, next/navigation et next/image sont définis
// globalement dans tests/setup.tsx (appliqués automatiquement à tous les tests).

describe('Header', () => {
  it('affiche le lien Accueil pointant vers /', () => {
    render(
      <CartProvider isLoggedIn={false}>
        <Header isLoggedIn={false} />
      </CartProvider>
    );
    const accueilLinks = screen.getAllByRole('link', { name: /accueil/i });
    expect(accueilLinks.length).toBeGreaterThan(0);
    accueilLinks.forEach((link) => {
      expect(link).toHaveAttribute('href', '/');
    });
  });

  it('affiche tous les liens du menu', () => {
    render(
      <CartProvider isLoggedIn={false}>
        <Header isLoggedIn={false} />
      </CartProvider>
    );
    expect(
      screen.getAllByRole('link', { name: /accueil/i }).length
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByRole('link', { name: /arbres/i }).length
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByRole('link', { name: /projets/i }).length
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByRole('link', { name: /a propos/i }).length
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByRole('link', { name: /contact/i }).length
    ).toBeGreaterThan(0);
  });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Field from '@/components/layout/Field';

// Les mocks globaux (next/link, next/navigation, next/image) sont dans tests/setup.tsx

describe('Field', () => {
  it('affiche le label fourni en prop', () => {
    render(<Field id="email" label="Email" value="" onChange={() => {}} />);

    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it("affiche la valeur actuelle dans l'input", () => {
    render(
      <Field
        id="email"
        label="Email"
        value="hello@greenroots.fr"
        onChange={() => {}}
      />
    );

    const input = screen.getByLabelText('Email');
    expect(input).toHaveValue('hello@greenroots.fr');
  });

  it("lie le label à l'input via htmlFor et id", () => {
    render(
      <Field
        id="username"
        label="Nom d'utilisateur"
        value=""
        onChange={() => {}}
      />
    );

    const input = screen.getByLabelText("Nom d'utilisateur");
    expect(input).toHaveAttribute('id', 'username');
    expect(input).toHaveAttribute('name', 'username');
  });

  it('utilise type="text" par défaut quand aucun type n\'est fourni', () => {
    render(
      <Field id="firstName" label="Prénom" value="" onChange={() => {}} />
    );

    const input = screen.getByLabelText('Prénom');
    expect(input).toHaveAttribute('type', 'text');
  });

  it('supporte le type "password" pour masquer la saisie', () => {
    render(
      <Field
        id="password"
        label="Mot de passe"
        type="password"
        value=""
        onChange={() => {}}
      />
    );

    const input = screen.getByLabelText('Mot de passe');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('supporte le type "email"', () => {
    render(
      <Field
        id="email"
        label="Email"
        type="email"
        value=""
        onChange={() => {}}
      />
    );

    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('type', 'email');
  });

  it("appelle onChange avec la nouvelle valeur quand l'utilisateur tape", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(<Field id="email" label="Email" value="" onChange={handleChange} />);

    const input = screen.getByLabelText('Email');
    await user.type(input, 'test');

    // userEvent.type tape lettre par lettre → 4 appels pour "test"
    expect(handleChange).toHaveBeenCalledTimes(4);
    // Chaque appel reçoit la dernière lettre tapée (car value reste vide en l'absence de re-render)
    expect(handleChange).toHaveBeenLastCalledWith('t');
  });

  it("n'appelle pas onChange si l'utilisateur ne touche pas à l'input", () => {
    const handleChange = vi.fn();

    render(
      <Field
        id="email"
        label="Email"
        value="déjà rempli"
        onChange={handleChange}
      />
    );

    expect(handleChange).not.toHaveBeenCalled();
  });
});

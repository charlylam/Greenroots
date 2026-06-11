'use client';

import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { SubmitEventHandler } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

type AuthMode = 'login' | 'register';
type AccountType = 'particulier' | 'entreprise';

export default function AuthForm() {
  const router = useRouter();

  const [mode, setMode] = useState<AuthMode>('login');
  const [accountType, setAccountType] = useState<AccountType>('particulier');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [registerData, setRegisterData] = useState({
    lastName: '',
    firstName: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    postalCode: '',
    city: '',
    siret: '',
    companyName: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  function updateRegisterField(
    field: keyof typeof registerData,
    value: string
  ) {
    setRegisterData({ ...registerData, [field]: value });
  }

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    setErrorMessage('');
  }

  const handleLogin: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Veuillez saisir une adresse email valide.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        setErrorMessage('Email ou mot de passe incorrect.');
        return;
      }

      router.push('/espace-client');
      router.refresh();
    } catch {
      setErrorMessage('Impossible de contacter le serveur.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    if (!registerData.lastName.trim()) {
      setErrorMessage('Le nom est obligatoire.');
      setIsLoading(false);
      return;
    }
    if (!registerData.firstName.trim()) {
      setErrorMessage('Le prénom est obligatoire.');
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerData.email)) {
      setErrorMessage('Veuillez saisir une adresse email valide.');
      setIsLoading(false);
      return;
    }
    if (registerData.password.length < 8) {
      setErrorMessage('Le mot de passe doit contenir au moins 8 caractères.');
      setIsLoading(false);
      return;
    }
    if (registerData.password !== registerData.confirmPassword) {
      setErrorMessage('Les mots de passe ne correspondent pas.');
      setIsLoading(false);
      return;
    }
    if (!registerData.address.trim()) {
      setErrorMessage("L'adresse est obligatoire.");
      setIsLoading(false);
      return;
    }
    if (!/^\d{5}$/.test(registerData.postalCode)) {
      setErrorMessage('Le code postal doit contenir 5 chiffres.');
      setIsLoading(false);
      return;
    }
    if (!registerData.city.trim()) {
      setErrorMessage('La ville est obligatoire.');
      setIsLoading(false);
      return;
    }
    if (accountType === 'entreprise' && !/^\d{14}$/.test(registerData.siret)) {
      setErrorMessage('Le numéro de SIRET doit contenir 14 chiffres.');
      setIsLoading(false);
      return;
    }
    if (accountType === 'entreprise' && !registerData.companyName.trim()) {
      setErrorMessage('La raison sociale est obligatoire.');
      setIsLoading(false);
      return;
    }
    if (!acceptTerms) {
      setErrorMessage(
        "Vous devez accepter les Conditions d'utilisation et la Politique de confidentialité."
      );
      setIsLoading(false);
      return;
    }

    const payload = {
      lastName: registerData.lastName,
      firstName: registerData.firstName,
      email: registerData.email,
      password: registerData.password,
      address: registerData.address,
      postalCode: registerData.postalCode,
      city: registerData.city,
      type: accountType,
      ...(accountType === 'entreprise' && {
        siret: registerData.siret,
        companyName: registerData.companyName,
      }),
      acceptedTerms: true,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        if (response.status === 409) {
          setErrorMessage('Un compte existe déjà avec cet email ou ce SIRET.');
          return;
        }
        setErrorMessage(
          'Impossible de créer le compte. Vérifiez les informations saisies.'
        );
        return;
      }

      setMode('login');
      setEmail(registerData.email);
      setPassword('');
    } catch {
      setErrorMessage('Impossible de contacter le serveur.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-brand-bg text-brand-dark">
      <section className="relative isolate min-h-screen overflow-hidden">
        <Image
          src="/images/background-image-main.jpg"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_top]"
        />

        <div className="relative z-10">
          <div
            className={
              mode === 'login'
                ? 'flex min-h-screen items-start justify-center px-4 pt-28 pb-10 md:pt-36'
                : 'flex min-h-screen items-start justify-center px-4 pt-24 pb-10 md:pt-32'
            }
          >
            <div
              className={
                mode === 'login'
                  ? 'w-full max-w-lg rounded-[28px] bg-brand-white px-6 py-6 text-brand-dark shadow-sm sm:px-10 md:py-10'
                  : 'w-full max-w-2xl rounded-[28px] bg-brand-white px-6 py-5 text-brand-dark shadow-sm sm:px-8 md:px-10'
              }
            >
              {mode === 'login' ? (
                <form
                  onSubmit={handleLogin}
                  className="space-y-6"
                  aria-label="Formulaire de connexion"
                  aria-busy={isLoading}
                  noValidate
                >
                  <div className="space-y-5">
                    <div>
                      <h1 className="text-3xl font-bold">Connexion</h1>
                      <p className="mt-2 text-brand-muted">
                        Connectez-vous à votre espace GreenRoots.
                      </p>
                    </div>

                    <FormField
                      id="login-email"
                      label="Email"
                      type="email"
                      value={email}
                      onChange={setEmail}
                      required
                    />

                    <FormField
                      id="login-password"
                      label="Mot de passe"
                      type="password"
                      value={password}
                      onChange={setPassword}
                      required
                    />
                  </div>

                  {errorMessage && <ErrorMessage message={errorMessage} />}

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      aria-disabled={isLoading}
                      className="h-11 cursor-pointer rounded-md bg-brand-dark px-6 font-semibold text-brand-white hover:bg-brand-accent disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isLoading ? (
                        <>
                          <span aria-hidden="true">Connexion...</span>
                          <span className="sr-only">
                            Connexion en cours, veuillez patienter
                          </span>
                        </>
                      ) : (
                        'Suivant'
                      )}
                    </Button>
                  </div>

                  <div className="space-y-3 pt-4">
                    <p className="text-sm">
                      Pas de compte ? Créez-en un en quelques clics&nbsp;!
                    </p>
                    <Button
                      type="button"
                      onClick={() => switchMode('register')}
                      className="h-11 cursor-pointer rounded-md bg-brand-dark px-6 font-semibold text-brand-white hover:bg-brand-accent"
                    >
                      Inscription
                    </Button>
                  </div>
                </form>
              ) : (
                <form
                  onSubmit={handleRegister}
                  className="space-y-4"
                  aria-label="Formulaire d'inscription"
                  aria-busy={isLoading}
                  noValidate
                >
                  <div>
                    <h1 className="text-3xl font-bold">Créer un compte</h1>
                  </div>

                  <div
                    role="group"
                    aria-label="Type de compte"
                    className="flex flex-col gap-3 sm:flex-row sm:gap-16"
                  >
                    <button
                      type="button"
                      onClick={() => setAccountType('particulier')}
                      aria-pressed={accountType === 'particulier'}
                      className={
                        accountType === 'particulier'
                          ? 'cursor-pointer border-b-2 border-brand-accent pb-1 font-semibold text-brand-dark'
                          : 'cursor-pointer pb-1 text-brand-dark hover:border-b-2 hover:border-brand-accent'
                      }
                    >
                      Je suis un particulier
                    </button>

                    <button
                      type="button"
                      onClick={() => setAccountType('entreprise')}
                      aria-pressed={accountType === 'entreprise'}
                      className={
                        accountType === 'entreprise'
                          ? 'cursor-pointer border-b-2 border-brand-accent pb-1 font-semibold text-brand-dark'
                          : 'cursor-pointer pb-1 text-brand-dark hover:border-b-2 hover:border-brand-accent'
                      }
                    >
                      Je suis un professionnel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-x-6 gap-y-3 md:grid-cols-2">
                    <FormField
                      id="lastName"
                      label="Nom"
                      value={registerData.lastName}
                      onChange={(value) =>
                        updateRegisterField('lastName', value)
                      }
                      required
                    />

                    <FormField
                      id="firstName"
                      label="Prénom"
                      value={registerData.firstName}
                      onChange={(value) =>
                        updateRegisterField('firstName', value)
                      }
                      required
                    />

                    <div className="md:col-span-2">
                      <FormField
                        id="register-email"
                        label="Email"
                        type="email"
                        value={registerData.email}
                        onChange={(value) =>
                          updateRegisterField('email', value)
                        }
                        required
                      />
                    </div>

                    <div>
                      <FormField
                        id="register-password"
                        label="Mot de passe"
                        type="password"
                        value={registerData.password}
                        onChange={(value) =>
                          updateRegisterField('password', value)
                        }
                        required
                        describedBy="password-hint"
                      />
                      <p
                        id="password-hint"
                        className="mt-1 text-xs text-brand-muted"
                      >
                        Minimum 8 caractères, avec une majuscule, un chiffre et
                        un caractère spécial.
                      </p>
                    </div>

                    <FormField
                      id="confirmPassword"
                      label="Confirmation du mot de passe"
                      type="password"
                      value={registerData.confirmPassword}
                      onChange={(value) =>
                        updateRegisterField('confirmPassword', value)
                      }
                      required
                    />

                    <div className="md:col-span-2">
                      <FormField
                        id="address"
                        label="Adresse"
                        value={registerData.address}
                        onChange={(value) =>
                          updateRegisterField('address', value)
                        }
                        required
                      />
                    </div>

                    <FormField
                      id="postalCode"
                      label="Code postal"
                      value={registerData.postalCode}
                      onChange={(value) =>
                        updateRegisterField('postalCode', value)
                      }
                      required
                      inputMode="numeric"
                    />

                    <FormField
                      id="city"
                      label="Ville"
                      value={registerData.city}
                      onChange={(value) => updateRegisterField('city', value)}
                      required
                    />

                    {accountType === 'entreprise' && (
                      <>
                        <FormField
                          id="siret"
                          label="Numéro de SIRET"
                          value={registerData.siret}
                          onChange={(value) =>
                            updateRegisterField('siret', value)
                          }
                          required
                          inputMode="numeric"
                        />
                        <FormField
                          id="companyName"
                          label="Raison sociale"
                          value={registerData.companyName}
                          onChange={(value) =>
                            updateRegisterField('companyName', value)
                          }
                          required
                        />
                      </>
                    )}
                  </div>

                  <div className="rounded-md border border-gray-200 p-3">
                    <label className="flex items-start gap-3 text-sm">
                      <input
                        type="checkbox"
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                        className="mt-1"
                        required
                        aria-required="true"
                      />
                      <span>
                        J&apos;ai lu et j&apos;accepte les{' '}
                        <Link
                          href="/conditions-generales-utilisations"
                          target="_blank"
                          className="font-medium underline"
                        >
                          Conditions Générales d&apos;Utilisation
                        </Link>{' '}
                        ainsi que la{' '}
                        <Link
                          href="/politique-confidentialite"
                          target="_blank"
                          className="font-medium underline"
                        >
                          Politique de confidentialité
                        </Link>
                        .
                      </span>
                    </label>
                  </div>

                  {errorMessage && <ErrorMessage message={errorMessage} />}

                  <div className="flex items-center justify-between gap-4 pt-1">
                    <button
                      type="button"
                      onClick={() => switchMode('login')}
                      className="cursor-pointer text-sm text-brand-dark underline-offset-4 hover:underline"
                    >
                      Déjà un compte ? Se connecter
                    </button>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      aria-disabled={isLoading}
                      className="h-11 cursor-pointer rounded-md bg-brand-dark px-6 font-semibold text-brand-white hover:bg-brand-accent disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isLoading ? (
                        <>
                          <span aria-hidden="true">Inscription...</span>
                          <span className="sr-only">
                            Inscription en cours, veuillez patienter
                          </span>
                        </>
                      ) : (
                        'Je m\u2019inscris'
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

type FormFieldProps = {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  describedBy?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
};

function FormField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  required = false,
  describedBy,
  inputMode,
}: FormFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === 'password';

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm text-brand-dark">
        {label}
        {required && (
          <span aria-hidden="true" className="ml-1 text-red-600">
            *
          </span>
        )}
      </label>

      <div className="relative">
        <Input
          id={id}
          name={id}
          type={isPasswordField ? (showPassword ? 'text' : 'password') : type}
          required={required}
          aria-required={required}
          aria-describedby={describedBy}
          inputMode={inputMode}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 rounded-md bg-brand-white pr-10"
        />

        {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-brand-accent"
            aria-label={
              showPassword
                ? 'Masquer le mot de passe'
                : 'Afficher le mot de passe'
            }
            aria-controls={id}
          >
            {showPassword ? (
              <EyeOff size={18} aria-hidden="true" />
            ) : (
              <Eye size={18} aria-hidden="true" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <p
      role="alert"
      aria-live="assertive"
      className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {message}
    </p>
  );
}

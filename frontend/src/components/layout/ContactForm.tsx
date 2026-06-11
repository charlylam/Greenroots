'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Field from '@/components/layout/Field';
import Link from 'next/link';

export default function ContactForm() {
  const [form, setForm] = useState({
    lastName: '',
    firstName: '',
    email: '',
    object: '',
    message: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);

  function updateField(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    if (!form.lastName.trim()) {
      setErrorMessage('Le nom est obligatoire.');
      setIsLoading(false);
      return;
    }

    if (!form.firstName.trim()) {
      setErrorMessage('Le prénom est obligatoire.');
      setIsLoading(false);
      return;
    }

    if (!form.email.trim()) {
      setErrorMessage("L'adresse email est obligatoire.");
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(form.email)) {
      setErrorMessage('Veuillez saisir une adresse email valide.');
      setIsLoading(false);
      return;
    }

    if (!form.object.trim()) {
      setErrorMessage("L'objet est obligatoire.");
      setIsLoading(false);
      return;
    }

    if (!form.message.trim()) {
      setErrorMessage('Le message est obligatoire.');
      setIsLoading(false);
      return;
    }

    if (!acceptPrivacy) {
      setErrorMessage(
        'Vous devez accepter que vos données soient utilisées pour répondre à votre demande.'
      );
      setIsLoading(false);
      return;
    }

    const emailjs = (await import('@emailjs/browser')).default;

    emailjs
      .send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          from_name: `${form.firstName} ${form.lastName}`,
          from_email: form.email,
          subject: form.object,
          message: form.message,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      )
      .then(() => {
        setSuccessMessage('Votre message a bien été envoyé 🌱');
        setForm({
          lastName: '',
          firstName: '',
          email: '',
          object: '',
          message: '',
        });
        setAcceptPrivacy(false);
      })
      .catch(() => setErrorMessage("Erreur lors de l'envoi du message."))
      .finally(() => setIsLoading(false));
  }

  return (
    <main className="min-h-screen bg-brand-bg text-brand-dark">
      <section className="relative min-h-screen overflow-hidden">
        {/*
          IMAGE DE FOND — purement décorative.
          alt="" indique aux lecteurs d'écran de l'ignorer complètement.
        */}
        <Image
          src="/images/background-image-main.jpg"
          alt=""
          aria-hidden="true"
          fill
          priority
          className="object-cover object-center"
        />

        {/* OVERLAY */}
        <div className="absolute inset-0" />

        {/* CONTENT */}
        <div className="relative z-10 flex min-h-screen items-center justify-center px-4 pt-36 pb-20">
          <div className="w-full max-w-2xl rounded-[28px] bg-brand-white/95 p-6 shadow-sm backdrop-blur-sm md:p-7">
            <h1 className="mb-4 text-3xl font-bold">Contact</h1>

            {/*
              aria-busy : signale aux lecteurs d'écran que le formulaire
              est en cours de traitement pendant l'envoi.
            */}
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
              aria-busy={isLoading}
              noValidate
            >
              {/* NOM / PRÉNOM */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field
                  id="lastName"
                  label="Nom"
                  value={form.lastName}
                  onChange={(v) => updateField('lastName', v)}
                  required
                  error={!!errorMessage && !form.lastName.trim()}
                />
                <Field
                  id="firstName"
                  label="Prénom"
                  value={form.firstName}
                  onChange={(v) => updateField('firstName', v)}
                  required
                  error={!!errorMessage && !form.firstName.trim()}
                />
              </div>

              {/* EMAIL */}
              <Field
                id="email"
                label="Email"
                type="email"
                value={form.email}
                onChange={(v) => updateField('email', v)}
                required
                error={!!errorMessage && !form.email.trim()}
              />

              {/* OBJET */}
              <Field
                id="object"
                label="Objet"
                value={form.object}
                onChange={(v) => updateField('object', v)}
                required
                error={!!errorMessage && !form.object.trim()}
              />

              {/* MESSAGE */}
              <div className="space-y-1.5">
                <label htmlFor="message" className="text-sm text-brand-dark">
                  Message
                  <span aria-hidden="true" className="ml-1 text-red-600">
                    *
                  </span>
                </label>
                <textarea
                  id="message"
                  value={form.message}
                  onChange={(e) => updateField('message', e.target.value)}
                  className="min-h-[110px] w-full rounded-md border border-gray-200 bg-white p-3 text-sm"
                  placeholder="Écrivez votre message..."
                  required
                  aria-required="true"
                  aria-invalid={!!errorMessage && !form.message.trim()}
                />
              </div>

              {/*
                role="alert" + aria-live="assertive" :
                les lecteurs d'écran annoncent immédiatement le message
                d'erreur ou de succès dès qu'il apparaît, sans que
                l'utilisateur ait à naviguer jusqu'à lui.
              */}
              {errorMessage && (
                <p
                  role="alert"
                  aria-live="assertive"
                  className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {errorMessage}
                </p>
              )}

              {successMessage && (
                <p
                  role="status"
                  aria-live="polite"
                  className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-700"
                >
                  {successMessage}
                </p>
              )}

              <div className="rounded-md border border-gray-200 p-3">
                <label className="flex items-start gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={acceptPrivacy}
                    onChange={(event) => setAcceptPrivacy(event.target.checked)}
                    className="mt-1"
                    required
                    aria-required="true"
                  />
                  <span>
                    J&apos;accepte que les informations saisies dans ce
                    formulaire soient utilisées pour me recontacter dans le
                    cadre de ma demande, conformément à la{' '}
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

              {/* Légende champs obligatoires */}
              <p className="text-xs text-brand-muted">
                <span aria-hidden="true">* </span>Champs obligatoires
              </p>

              {/* BUTTON
                bg-brand-dark (#212a25) + text-white → ratio ~14:1 ✅
                bg-brand-accent (#88b75d) + text-white → ratio ~2.9:1 ❌
                On utilise brand-dark pour le hover afin de garantir le contraste.
              */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isLoading}
                  aria-disabled={isLoading}
                  className="bg-brand-dark text-white hover:bg-brand-accent hover:text-brand-dark"
                >
                  {isLoading ? (
                    <>
                      <span aria-hidden="true">Envoi...</span>
                      <span className="sr-only">
                        Envoi en cours, veuillez patienter
                      </span>
                    </>
                  ) : (
                    'Envoyer'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

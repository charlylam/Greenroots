import { createCheckoutSession } from '@/lib/api';
import { NextResponse } from 'next/server';

// ================================================================
// ROUTE API : CRÉATION DE SESSION DE PAIEMENT STRIPE
// ================================================================
// Route intermédiaire : le cookie httpOnly contenant le token JWT
// n'est lisible que côté serveur Next.js, jamais côté navigateur.
// Cette route lit le cookie, appelle le backend Express avec le
// header Authorization requis, puis retransmet la réponse au client.

export const POST = async () => {
  try {
    const data = await createCheckoutSession();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          message:
            error instanceof Error
              ? error.message
              : 'Impossible de créer la session de paiement',
        },
      },
      { status: 500 }
    );
  }
};

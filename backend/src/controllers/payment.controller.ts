import type { Request, Response } from 'express';
import Stripe from 'stripe';
import { prisma } from '../lib/prisma.js';
import { UnauthorizedError, ValidationError } from '../lib/errors.js';

// Point d'entrée de la création du paiement.
// Cette fonction prépare la session Stripe à partir du panier actif de l'utilisateur,
// puis renvoie l'URL de paiement au front pour redirection.
export async function createCheckoutSession(req: Request, res: Response) {
  // Lecture des variables d'environnement nécessaires au bon fonctionnement de Stripe.
  // Sans clé secrète ou URL front, le paiement ne peut pas être initialisé.
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const frontendUrl = process.env.FRONTEND_URL;

  if (!stripeSecretKey || !frontendUrl) {
    throw new Error('Configuration Stripe manquante');
  }

  const stripe = new Stripe(stripeSecretKey);

  // L'authentification est obligatoire ici : on ne peut pas créer de paiement
  // pour un utilisateur anonyme, car le panier est lié à un compte utilisateur.
  const userId = req.user?.userId;

  if (!userId) {
    throw new UnauthorizedError('User not authenticated');
  }

  const cart = await prisma.cart.findFirst({
    where: {
      userId,
      status: 'active',
    },
    include: {
      items: {
        include: {
          tree: true,
          project: true,
        },
      },
    },
  });

  // On vérifie que le panier existe bien et contient au moins un article.
  // Sans article, il n'y a rien à facturer, donc la session de paiement ne doit pas être créée.
  if (!cart || cart.items.length === 0) {
    throw new ValidationError('Cart is empty');
  }

  // Création effective de la session Stripe Checkout.
  // Chaque ligne du panier est convertie en élément de paiement avec son prix en centimes d'euros.
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: cart.items.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: 'eur',
        unit_amount: Math.round(Number(item.tree.price) * 100),
        product_data: {
          name: item.tree.commonName,
          description: item.project.name,
        },
      },
    })),
    success_url: `${frontendUrl}/paiement/succes`,
    cancel_url: `${frontendUrl}/paiement/annule`,
    metadata: {
      userId: String(userId),
      cartId: String(cart.id),
    },
  });

  return res.status(200).json({ url: session.url });
}

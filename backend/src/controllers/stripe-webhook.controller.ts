import type { Request, Response } from 'express';
import Stripe from 'stripe';
import { prisma } from '../lib/prisma.js';
import { ValidationError } from '../lib/errors.js';
import { createOrderFromActiveCart } from '../services/order.service.js';
import { sendOrderConfirmationEmail } from '../services/mail.service.js';

// Gère l'appel envoyé par Stripe lorsqu'un paiement est finalisé.
// Ce point d'entrée valide l'événement, puis déclenche la logique métier
// qui transforme le panier actif en commande confirmée.
export async function handleStripeWebhook(req: Request, res: Response) {
  // Récupère les variables de configuration nécessaires pour communiquer avec l'API Stripe.
  // La clé secrète sert à initialiser le client Stripe, tandis que le secret webhook
  // permet de vérifier l'authenticité des événements envoyés par Stripe.
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecretKey || !stripeWebhookSecret) {
    throw new Error('Stripe webhook configuration is missing');
  }

  const stripe = new Stripe(stripeSecretKey);

  // Stripe envoie un en-tête signature pour prouver que la requête vient bien de lui.
  // Sans cette signature, nous ne pouvons pas garantir l'origine de l'événement.
  const signature = req.headers['stripe-signature'];

  if (!signature) {
    throw new ValidationError('Missing Stripe signature');
  }

  let event: Stripe.Event;

  // Vérifie que le webhook a bien été envoyé par Stripe.
  // Cette étape confirme que le payload n'a pas été altéré et qu'il provient bien de Stripe.
  // Si la signature est invalide ou que le contenu a été modifié,
  // Stripe lève une exception que l'on transforme en erreur de validation.
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      stripeWebhookSecret
    );
  } catch {
    throw new ValidationError('Invalid Stripe signature');
  }

  // Si l'événement correspond à une session de paiement terminée,
  // on récupère les métadonnées de Stripe liées au panier et à l'utilisateur.
  // Ces informations permettent de retrouver le panier payé et de créer la commande.
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const userId = Number(session.metadata?.userId);
    const cartId = Number(session.metadata?.cartId);

    // Les métadonnées envoyées par Stripe doivent être présentes pour
    // relier correctement la session de paiement au panier utilisateur.
    if (!userId || !cartId) {
      throw new ValidationError('Missing Stripe metadata');
    }

    try {
      // La création de la commande, la décrémentation du stock et la conversion
      // du panier sont réalisées dans une transaction Prisma.
      const order = await prisma.$transaction((tx) =>
        createOrderFromActiveCart(tx, userId, cartId)
      );

      console.log('Order created after Stripe payment', {
        userId,
        cartId,
      });

      try {
        await sendOrderConfirmationEmail(
          order.user.email,
          order.user.firstName,
          String(order.id)
        );
      } catch (error) {
        console.error(
          "Erreur lors de l'envoi du mail de confirmation après paiement Stripe",
          error
        );
      }
    } catch (error) {
      // Un paiement Stripe a été encaissé mais la commande n'a pas pu être créée
      // (stock insuffisant, erreur Prisma...). On logue avec le contexte complet
      // pour permettre une intervention manuelle : le client a été débité sans
      // commande enregistrée côté GreenRoots.
      console.error(
        'Échec de création de commande après paiement Stripe confirmé',
        { userId, cartId, sessionId: session.id, error }
      );
    }
  }

  // Réponse positive à Stripe pour lui confirmer que l'événement a bien été traité.
  return res.status(200).json({
    received: true,
  });
}

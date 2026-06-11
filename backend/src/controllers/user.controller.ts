import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { NotFoundError } from '../lib/errors.js';
import {
  updateUserBodySchema,
  orderIdParamSchema,
} from '../validators/user.validator.js';
import { sendAccountDeletionEmail } from '../services/mail.service.js';

// Champs renvoyés pour le profil — on exclut password.
const userSelect = {
  id: true,
  lastName: true,
  firstName: true,
  email: true,
  role: true,
  address: true,
  postalCode: true,
  city: true,
  type: true,
  siret: true,
  companyName: true,
  phone: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const userController = {
  /** GET /api/users/me — profil de l'utilisateur connecté. */
  async me(req: Request, res: Response): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: userSelect,
    });

    if (!user) {
      throw new NotFoundError('Utilisateur introuvable');
    }

    res.status(200).json({ data: user });
  },

  /** PUT /api/users/me — mise à jour partielle du profil. */
  async update(req: Request, res: Response): Promise<void> {
    const body = updateUserBodySchema.parse(req.body);

    // On retire les clés undefined pour respecter exactOptionalPropertyTypes.
    const data = Object.fromEntries(
      Object.entries(body).filter(([, v]) => v !== undefined)
    );
    const user = await prisma.user.update({
      where: { id: req.user!.userId },
      data: data,
      select: userSelect,
    });

    res.status(200).json({ data: user });
  },

  /**
   * DELETE /api/users/me — suppression du compte (conditionnelle).
   *
   * Logique RGPD :
   * - Si l'utilisateur n'a AUCUNE commande, on supprime complètement son
   *   compte. Son panier actif est supprimé en cascade automatiquement
   *   (Cart.user_id est en ON DELETE CASCADE).
   * - Si l'utilisateur a des commandes, on anonymise ses données perso
   *   pour respecter la traçabilité comptable (onDelete: Restrict sur
   *   Order.user empêcherait sinon la suppression). Le panier actif est
   *   supprimé en parallèle car il devient orphelin.
   *
   * Dans les deux cas, l'utilisateur ne pourra plus se connecter :
   * - hard delete → plus d'enregistrement
   * - anonymisation → auth.controller refuse le login si deletedAt !== null
   */
  async remove(req: Request, res: Response): Promise<void> {
    const userId = req.user!.userId;

    // On récupère l'utilisateur concerné
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        firstName: true,
      },
    });

    if (!user) {
      throw new NotFoundError('Utilisateur introuvable');
    }
    // On envoie l'email avant la suppression du compte
    try {
      await sendAccountDeletionEmail(user.email, user.firstName);
    } catch (error) {
      console.error(
        '[userController.remove] Erreur envoi email suppression compte :',
        error
      );
    }

    // Compte le nombre de commandes pour déterminer la stratégie.
    const orderCount = await prisma.order.count({ where: { userId } });

    // Cas 1 : pas de commandes → suppression complète.
    // Le panier sera supprimé via la cascade définie dans le schéma.
    if (orderCount === 0) {
      await prisma.user.delete({ where: { id: userId } });
      res.status(204).end();
      return;
    }

    // Cas 2 : des commandes existent → anonymisation + nettoyage du panier.
    // Le panier actif est supprimé car il deviendrait orphelin (l'utilisateur
    // anonymisé ne pourra plus se connecter pour le récupérer).
    await prisma.$transaction([
      prisma.cart.deleteMany({
        where: { userId, status: 'active' },
      }),
      prisma.user.update({
        where: { id: userId },
        data: {
          email: `deleted-${userId}@anonymized.local`,
          lastName: 'Anonyme',
          firstName: 'Utilisateur',
          address: '',
          postalCode: '',
          city: '',
          phone: null,
          siret: null,
          companyName: null,
          password: '',
          deletedAt: new Date(),
        },
      }),
    ]);

    res.status(204).end();
  },

  /** GET /api/users/me/orders — historique des commandes. */
  async listOrders(req: Request, res: Response): Promise<void> {
    const orders = await prisma.order.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            project: { select: { name: true, slug: true } },
          },
        },
      },
    });

    res.status(200).json({ data: orders });
  },

  /** GET /api/users/me/orders/:id — détail d'une commande. */
  async getOrder(req: Request, res: Response): Promise<void> {
    const { id } = orderIdParamSchema.parse(req.params);

    const order = await prisma.order.findFirst({
      where: { id, userId: req.user!.userId },
      include: {
        items: {
          include: {
            project: { select: { name: true, slug: true } },
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundError('Commande introuvable');
    }

    res.status(200).json({ data: order });
  },
};

import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { createOrderFromActiveCart } from '../services/order.service.js';
import { sendOrderConfirmationEmail } from '../services/mail.service.js';

export const orderController = {
  async create(req: Request, res: Response): Promise<void> {
    const userId = req.user!.userId;

    const { order, wasAlreadyExisting } = await prisma.$transaction((tx) =>
      createOrderFromActiveCart(tx, userId)
    );

    if (!wasAlreadyExisting) {
      try {
        await sendOrderConfirmationEmail(
          order.user.email,
          order.user.firstName,
          String(order.id)
        );
      } catch (error) {
        console.error('Erreur lors de l\'envoi du mail de confirmation', error);
      }
    }

    res.status(201).json({ data: order });
  },
};

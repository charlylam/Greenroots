import { prisma } from '../lib/prisma.js';

export async function getOrCreateActiveCart(userId: number) {
  // Cherche le panier actif de l'utilisateur
  const cart = await prisma.cart.findFirst({
    where: { userId: userId!, status: 'active' },
  });

  // Si aucun panier actif n'existe, on en crée un nouveau
  if (!cart) {
    return await prisma.cart.create({
      data: {
        userId: userId,
        status: 'active',
      },
    });
  }

  return cart;
}

import { PrismaClient } from '@prisma/client';
import { NotFoundError, ValidationError } from '../lib/errors.js';

type TransactionClient = Parameters<
  Parameters<PrismaClient['$transaction']>[0]
>[0];

export async function createOrderFromActiveCart(
  tx: TransactionClient,
  userId: number,
  cartId?: number
) {
  if (cartId) {
    const existingOrder = await tx.order.findUnique({
      where: {
        cartId,
      },
      include: {
        user: true,
        items: {
          include: {
            project: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    if (existingOrder) {
      return { order: existingOrder, wasAlreadyExisting: true };
    }
  }
  const cart = await tx.cart.findFirst({
    where: {
      userId,
      status: 'active',
      ...(cartId ? { id: cartId } : {}),
    },
    include: {
      items: {
        include: {
          tree: true,
        },
      },
    },
  });

  if (!cart) {
    throw new NotFoundError('Aucun panier actif');
  }

  if (cart.items.length === 0) {
    throw new ValidationError('Le panier est vide');
  }

  const amount = cart.items.reduce(
    (sum, item) => sum + Number(item.tree.price) * item.quantity,
    0
  );

  for (const item of cart.items) {
    const updated = await tx.projectHasTree.updateMany({
      where: {
        treeId: item.treeId,
        projectId: item.projectId,
        stock: { gte: item.quantity },
      },
      data: {
        stock: { decrement: item.quantity },
      },
    });

    if (updated.count === 0) {
      throw new ValidationError(
        `Stock insuffisant pour "${item.tree.commonName}"`
      );
    }
  }

  const order = await tx.order.create({
    data: {
      userId,
      cartId: cart.id,
      amount,
      items: {
        create: cart.items.map((item) => ({
          treeId: item.treeId,
          projectId: item.projectId,
          treeCommonName: item.tree.commonName,
          quantity: item.quantity,
          unitPrice: item.tree.price,
        })),
      },
    },
    include: {
      user: true,
      items: {
        include: {
          project: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
      },
    },
  });

  await tx.cart.update({
    where: {
      id: cart.id,
    },
    data: {
      status: 'converted',
    },
  });

  return { order, wasAlreadyExisting: false };
}

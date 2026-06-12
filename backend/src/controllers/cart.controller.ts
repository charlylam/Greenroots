import type { Request, Response } from 'express';
import { NotFoundError, ValidationError } from '../lib/errors.js';
import { prisma } from '../lib/prisma.js';
import { getOrCreateActiveCart } from '../lib/cartUtils.js';
import {
  addCartItemSchema,
  changeItemQuantitySchema,
  cartItemIdParamSchema,
} from '../validators/cart.validator.js';

/*
Points à revoir : 
La concurrence sur le stock (deux requêtes simultanées peuvent passer le contrôle ensemble)
Le Decimal converti en float pour le calcul du total
Le typage de req.user à nettoyer un jour pour virer le ?.
*/

export async function getActiveCart(req: Request, res: Response) {
  // Récupère l'utilisateur courant depuis le token de session
  const userId = Number(req.user?.userId);

  // Crée un panier actif si besoin ou récupère celui existant
  const cart = await getOrCreateActiveCart(userId);

  // Inclut les détails des articles, des arbres et des projets associés
  const cartWithItems = await prisma.cart.findUnique({
    where: { id: cart.id },
    include: {
      items: {
        orderBy: { id: 'asc' },
        select: {
          quantity: true,
          id: true,
          tree: {
            select: {
              commonName: true,
              price: true,
              picture: true,
            },
          },
          project: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (!cartWithItems) {
    throw new NotFoundError();
  }

  // Calcule le total du panier en multipliant quantité par prix
  const cartTotal = cartWithItems.items.reduce(
    (acc, item) => acc + item.quantity * Number(item.tree.price),
    0
  );

  return res
    .status(200)
    .json({ data: cartWithItems, meta: { total: cartTotal } });
}

export async function addItemToCart(req: Request, res: Response) {
  // Récupère l'utilisateur courant depuis le token de session
  const userId = Number(req.user?.userId);

  // Récupère les infos envoyés depuis le front + validation zod
  const { treeId, projectId, quantity } = addCartItemSchema.parse(req.body);

  // Récupère (ou crée) le panier actif de l'utilisateur
  const cart = await getOrCreateActiveCart(userId);

  // Vérifie que l'arbre est bien lié au projet demandé
  const treeAndProject = await prisma.projectHasTree.findUnique({
    where: {
      projectId_treeId: { projectId, treeId },
    },
  });
  if (!treeAndProject) {
    throw new NotFoundError('Arbre ou projet introuvable');
  }

  // Cherche si l'article est déjà présent dans le panier
  const cartItem = await prisma.cartItem.findUnique({
    where: {
      cartId_treeId_projectId: { cartId: cart.id, treeId, projectId },
    },
  });
  // Récupère le stock pour cet arbre
  const stock = treeAndProject.stock;
  if (cartItem) {
    // L'article existe :
    // Vérifie la quantité disponible en stock
    if (cartItem.quantity + quantity > stock) {
      throw new ValidationError('Quantité non disponible');
    }
    // on incrémente la quantité
    const updatedCartItem = await prisma.cartItem.update({
      where: {
        id: cartItem.id,
      },
      data: { quantity: quantity + cartItem.quantity },
    });
    return res.status(200).json({ data: updatedCartItem });
  } else {
    // L'article n'existe pas :
    // Vérifie la quantité disponible en stock
    if (quantity > stock) {
      throw new ValidationError('Quantité non disponible');
    }
    // on crée une nouvelle ligne
    const newCartItem = await prisma.cartItem.create({
      data: {
        treeId,
        projectId,
        quantity,
        cartId: cart.id,
      },
    });
    return res.status(201).json({ data: newCartItem });
  }
}

export async function changeItemQuantity(req: Request, res: Response) {
  // Récupère l'utilisateur courant depuis le token de session
  const userId = Number(req.user?.userId);

  // On récupère l'id de l'article à modifier depuis les paramètres d'URL
  const cartItemId = cartItemIdParamSchema.parse(req.params).id;
  // Récupère les infos envoyés depuis le front + validation zod
  const { quantity } = changeItemQuantitySchema.parse(req.body);

  // On vérifie que l'article existe et appartient bien au panier de l'utilisateur
  const cartItem = await prisma.cartItem.findFirst({
    where: {
      id: cartItemId,
      cart: {
        userId,
        status: 'active',
      },
    },
  });
  if (!cartItem) {
    throw new NotFoundError('Article du panier introuvable');
  }

  const treeAndProject = await prisma.projectHasTree.findUnique({
    where: {
      projectId_treeId: {
        projectId: cartItem.projectId,
        treeId: cartItem.treeId,
      },
    },
  });
  if (!treeAndProject) {
    throw new NotFoundError('Arbre ou projet introuvable');
  }
  // Récupère le stock pour cet arbre
  const stock = treeAndProject.stock;
  // Vérifie la quantité disponible en stock
  if (quantity > stock) {
    throw new ValidationError('Quantité non disponible');
  }
  // on remplace la quantité
  const updatedCartItem = await prisma.cartItem.update({
    where: {
      id: cartItem.id,
    },
    data: { quantity },
  });
  return res.status(200).json({ data: updatedCartItem });
}

export async function deleteItemFromCart(req: Request, res: Response) {
  // Récupère l'utilisateur courant depuis le token de session
  const userId = Number(req.user?.userId);

  // On récupère l'id de l'article à modifier depuis les paramètres d'URL
  const cartItemId = cartItemIdParamSchema.parse(req.params).id;

  // On vérifie que l'article existe et appartient bien au panier de l'utilisateur
  const cartItem = await prisma.cartItem.findFirst({
    where: {
      id: cartItemId,
      cart: {
        userId,
        status: 'active',
      },
    },
  });
  if (!cartItem) {
    throw new NotFoundError('Article du panier introuvable');
  }

  // on supprime l'article
  await prisma.cartItem.delete({
    where: {
      id: cartItem.id,
    },
  });
  return res.status(200).json({ message: 'Article supprimé' });
}

export async function deleteAllItemsFromCart(req: Request, res: Response) {
  // Récupère l'utilisateur courant depuis le token de session
  const userId = Number(req.user?.userId);

  const cart = await prisma.cart.findFirst({
    where: {
      userId,
      status: 'active',
    },
  });

  if (!cart) {
    throw new NotFoundError('Panier introuvable');
  }

  await prisma.cartItem.deleteMany({
    where: {
      cartId: cart.id,
    },
  });

  return res
    .status(200)
    .json({ message: 'Tous les articles ont été supprimés' });
}

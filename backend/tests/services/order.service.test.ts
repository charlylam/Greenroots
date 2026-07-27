import assert from 'node:assert/strict';
import { describe, it, before, beforeEach } from 'node:test';
import { prisma } from '../../src/lib/prisma.js';
import { createOrderFromActiveCart } from '../../src/services/order.service.js';

const API_URL = 'http://localhost:3002';

// Utilisateur seedé, réutilisé depuis le même compte que les autres tests
// de commande, pour bénéficier des mêmes données de projet/arbre.
const TEST_USER = {
  email: 'thomas.martin@email.fr',
  password: 'Password123@',
};

let token: string;
let userId: number;
let projectId: number;
let treeId: number;
let treeStock: number;

async function login(): Promise<string> {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(TEST_USER),
  });
  const body = await res.json();
  if (!body.token) {
    throw new Error('Token introuvable dans la réponse de login');
  }
  return body.token;
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

async function emptyCart() {
  await fetch(`${API_URL}/api/carts`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
}

async function addItem(quantity: number) {
  await fetch(`${API_URL}/api/carts/items`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ treeId, projectId, quantity }),
  });
}

// Récupère l'id du panier actif de l'utilisateur de test, directement
// via Prisma, pour pouvoir appeler le service avec un cartId précis.
async function getActiveCartId(): Promise<number> {
  const cart = await prisma.cart.findFirst({
    where: { userId, status: 'active' },
  });
  if (!cart) {
    throw new Error('Aucun panier actif trouvé pour le test');
  }
  return cart.id;
}

before(async () => {
  token = await login();

  const user = await prisma.user.findUnique({
    where: { email: TEST_USER.email },
  });
  if (!user) {
    throw new Error('Utilisateur de test introuvable en base');
  }
  userId = user.id;

  const listRes = await fetch(`${API_URL}/api/projects`);
  const listBody = await listRes.json();
  const project = listBody.projects[0];
  projectId = project.id;

  const treesRes = await fetch(`${API_URL}/api/projects/${project.slug}/trees`);
  const treesBody = await treesRes.json();
  treeId = treesBody.trees[0].id;
  treeStock = treesBody.trees[0].stock;
});

// ------------------------------------------------------------
// Idempotence : rejeu du webhook Stripe pour le même panier
// ------------------------------------------------------------
// Vérifie que createOrderFromActiveCart distingue une commande
// nouvellement créée d'une commande déjà existante, pour permettre
// au webhook de ne pas renvoyer une deuxième fois l'email de
// confirmation en cas de rejeu de l'événement checkout.session.completed.
describe('[Service] createOrderFromActiveCart — idempotence sur rejeu', () => {
  beforeEach(async () => {
    await emptyCart();
  });

  it('should mark the first call as a genuinely new order', async () => {
    await addItem(1);
    const cartId = await getActiveCartId();

    const result = await prisma.$transaction((tx) =>
      createOrderFromActiveCart(tx, userId, cartId)
    );

    assert.equal(result.wasAlreadyExisting, false);
    assert.equal(result.order.cartId, cartId);
  });

  it('should mark a second call with the same cartId as already existing', async () => {
    await addItem(1);
    const cartId = await getActiveCartId();

    const first = await prisma.$transaction((tx) =>
      createOrderFromActiveCart(tx, userId, cartId)
    );
    const second = await prisma.$transaction((tx) =>
      createOrderFromActiveCart(tx, userId, cartId)
    );

    assert.equal(first.wasAlreadyExisting, false);
    assert.equal(second.wasAlreadyExisting, true);
    assert.equal(second.order.id, first.order.id);
  });
});

// ------------------------------------------------------------
// Stock pile au seuil disponible
// ------------------------------------------------------------
// Vérifie que commander exactement la quantité en stock aboutit à une
// commande valide et fait tomber le stock à zéro, et qu'une tentative
// suivante sur le même arbre échoue proprement plutôt que de passer
// en négatif ou de planter avec une erreur 500.
describe('[Service] createOrderFromActiveCart — stock pile au seuil', () => {
  beforeEach(async () => {
    await emptyCart();
  });

  it('should succeed when ordering exactly the available stock, and leave stock at zero', async () => {
    await addItem(treeStock);
    const cartId = await getActiveCartId();

    const result = await prisma.$transaction((tx) =>
      createOrderFromActiveCart(tx, userId, cartId)
    );

    assert.equal(result.wasAlreadyExisting, false);

    const projectHasTree = await prisma.projectHasTree.findUnique({
      where: {
        projectId_treeId: { projectId, treeId },
      },
    });
    assert.equal(projectHasTree?.stock, 0);
  });
});

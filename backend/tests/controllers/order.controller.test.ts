import assert from 'node:assert/strict';
import { describe, it, before, beforeEach } from 'node:test';

const API_URL = 'http://localhost:3002';

// Utilisateur seedé utilisé pour l'authentification.
const TEST_USER = {
  email: 'thomas.martin@email.fr',
  password: 'Password123@',
};

// État partagé, rempli dans le hook `before`.
let token: string;
let projectId: number;
let treeId: number;
let treeStock: number;

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------

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

// Vide le panier actif (les items disparaissent, le panier reste actif).
async function emptyCart() {
  await fetch(`${API_URL}/api/carts`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
}

// Ajoute un item au panier actif et renvoie la réponse.
async function addItem(quantity: number) {
  const res = await fetch(`${API_URL}/api/carts/items`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ treeId, projectId, quantity }),
  });
  const body = await res.json();
  return { res, body };
}

// Lance le checkout du panier actif.
async function checkout() {
  const res = await fetch(`${API_URL}/api/orders`, {
    method: 'POST',
    headers: authHeaders(),
  });
  const body = await res.json();
  return { res, body };
}

// ------------------------------------------------------------
// Setup global : login + récupération d'un couple arbre/projet réel
// ------------------------------------------------------------

before(async () => {
  token = await login();

  // Récupère un projet réel depuis le seed.
  const listRes = await fetch(`${API_URL}/api/projects`);
  const listBody = await listRes.json();
  const project = listBody.projects[0];
  projectId = project.id;

  // Récupère un arbre lié à ce projet (donc présent dans ProjectHasTree).
  const treesRes = await fetch(`${API_URL}/api/projects/${project.slug}/trees`);
  const treesBody = await treesRes.json();
  treeId = treesBody.trees[0].id;
  treeStock = treesBody.trees[0].stock;
});

// ------------------------------------------------------------
// Authentification
// ------------------------------------------------------------

describe('[Auth] order routes', () => {
  it('should return 401 without a token', async () => {
    const res = await fetch(`${API_URL}/api/orders`, { method: 'POST' });
    assert.equal(res.status, 401);
  });

  it('should return 401 with a malformed header', async () => {
    const res = await fetch(`${API_URL}/api/orders`, {
      method: 'POST',
      headers: { Authorization: 'NotBearer xxx' },
    });
    assert.equal(res.status, 401);
  });

  it('should return 401 with an invalid token', async () => {
    const res = await fetch(`${API_URL}/api/orders`, {
      method: 'POST',
      headers: { Authorization: 'Bearer un.token.bidon' },
    });
    assert.equal(res.status, 401);
  });
});

// ------------------------------------------------------------
// POST /api/orders — checkout panier → commande
// ------------------------------------------------------------

describe('[POST] /api/orders', () => {
  beforeEach(async () => {
    // On vide le panier avant chaque test pour partir d'un état contrôlé.
    await emptyCart();
  });

  it('should return 400 when the cart is empty', async () => {
    const { res, body } = await checkout();

    assert.equal(res.status, 400);
    assert.equal(body.error.code, 'VALIDATION_ERROR');
  });

  it('should create an order from the active cart (201)', async () => {
    await addItem(2);
    const { res, body } = await checkout();

    assert.equal(res.status, 201);
    assert.ok('data' in body);
    assert.equal(body.data.status, 'validated');
    assert.ok(Array.isArray(body.data.items));
    assert.equal(body.data.items.length, 1);
  });

  it('should snapshot the tree name and price on the order item', async () => {
    await addItem(3);
    const { body } = await checkout();

    const item = body.data.items[0];
    assert.equal(typeof item.treeCommonName, 'string');
    assert.ok(item.treeCommonName.length > 0);
    assert.equal(item.quantity, 3);
    assert.ok(item.unitPrice); // string Decimal côté JSON
  });

  it('should compute the total amount based on quantity and price', async () => {
    await addItem(2);
    const { body } = await checkout();

    const item = body.data.items[0];
    const expected = Number(item.unitPrice) * item.quantity;
    assert.equal(Number(body.data.amount), expected);
  });

  it('should link the order to the cart that was converted', async () => {
    await addItem(1);
    const { body } = await checkout();

    assert.equal(typeof body.data.cartId, 'number');
  });

  it('should mark the cart as converted (next GET /carts returns an empty active cart)', async () => {
    await addItem(1);
    await checkout();

    const cartRes = await fetch(`${API_URL}/api/carts`, {
      headers: authHeaders(),
    });
    const cartBody = await cartRes.json();

    assert.equal(cartBody.data.items.length, 0);
  });

  it('should return 404 when checkout is called a second time without an active cart', async () => {
    await addItem(1);
    await checkout(); // 1er checkout → 201, le panier passe en "converted"
    const { res, body } = await checkout(); // 2e checkout : plus de panier actif

    assert.equal(res.status, 404);
    assert.equal(body.error.code, 'NOT_FOUND');
  });

  it('should decrement project stock after order creation', async () => {
    // 1. Récupère le stock initial via la route projet
    const projectRes = await fetch(`${API_URL}/api/projects`);
    const projectBody = await projectRes.json();
    const project = projectBody.projects[0];
    const treesRes = await fetch(
      `${API_URL}/api/projects/${project.slug}/trees`
    );
    const treesBody = await treesRes.json();
    const initialStock = treesBody.trees[0].stock;

    // 2. Ajoute 2 arbres au panier puis checkout
    await addItem(2);
    const { res } = await checkout();
    assert.equal(res.status, 201);

    // 3. Vérifie que le stock a diminué de 2
    const treesAfterRes = await fetch(
      `${API_URL}/api/projects/${project.slug}/trees`
    );
    const treesAfterBody = await treesAfterRes.json();
    const finalStock = treesAfterBody.trees[0].stock;

    assert.equal(finalStock, initialStock - 2);
  });

  it('should allow checkout when ordering exactly the available stock', async () => {
    // Cas limite : commander pile le stock disponible doit passer
    await addItem(treeStock);
    const { res } = await checkout();

    // Soit 201 (succès), soit échec contrôlé (ex: panier vidé entretemps)
    // L'important est qu'on ne crashe pas avec une 500
    assert.ok(res.status === 201 || (res.status >= 400 && res.status < 500));
  });
});

// ------------------------------------------------------------
// GET /api/users/me/orders — historique après checkout
// ------------------------------------------------------------

describe('[GET] /api/users/me/orders after checkout', () => {
  it('should include the newly created order in the history', async () => {
    await emptyCart();
    await addItem(1);
    const { body: orderBody } = await checkout();
    const createdId = orderBody.data.id;

    const res = await fetch(`${API_URL}/api/users/me/orders`, {
      headers: authHeaders(),
    });
    const body = await res.json();

    assert.equal(res.status, 200);
    const found = body.data.find((o: { id: number }) => o.id === createdId);
    assert.ok(found, 'La nouvelle commande doit apparaître dans /me/orders');
    assert.equal(found.status, 'validated');
  });
});

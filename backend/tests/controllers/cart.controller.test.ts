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

  // Le contrôleur loginUser renvoie le token directement dans le body.
  const token = body.token;
  if (!token) {
    throw new Error('Token introuvable dans la réponse de login');
  }
  return token;
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

// Vide le panier actif (ignore le résultat : sert juste à isoler les tests).
async function emptyCart() {
  await fetch(`${API_URL}/api/carts`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
}

// Ajoute un item et renvoie l'id du CartItem créé.
async function addItem(quantity: number) {
  const res = await fetch(`${API_URL}/api/carts/items`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ treeId, projectId, quantity }),
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
  const tree = treesBody.trees[0];
  treeId = tree.id;
  treeStock = tree.stock;
});

// ------------------------------------------------------------
// Authentification
// ------------------------------------------------------------

describe('[Auth] cart routes', () => {
  it('should return 401 without a token', async () => {
    const res = await fetch(`${API_URL}/api/carts`);
    assert.equal(res.status, 401);
  });

  it('should return 401 with a malformed header', async () => {
    const res = await fetch(`${API_URL}/api/carts`, {
      headers: { Authorization: 'NotBearer xxx' },
    });
    assert.equal(res.status, 401);
  });
});

// ------------------------------------------------------------
// GET /api/carts
// ------------------------------------------------------------

describe('[GET] /api/carts', () => {
  it('should return the active cart with data and meta.total', async () => {
    const res = await fetch(`${API_URL}/api/carts`, {
      headers: authHeaders(),
    });
    const body = await res.json();

    assert.equal(res.status, 200);
    assert.ok('data' in body);
    assert.ok(Array.isArray(body.data.items));
    assert.ok(body.meta && typeof body.meta.total === 'number');
  });
});

// ------------------------------------------------------------
// POST /api/carts/items
// ------------------------------------------------------------

describe('[POST] /api/carts/items', () => {
  beforeEach(async () => {
    await emptyCart();
  });

  it('should add a new item (201)', async () => {
    const { res, body } = await addItem(1);

    assert.equal(res.status, 201);
    assert.equal(body.data.treeId, treeId);
    assert.equal(body.data.projectId, projectId);
    assert.equal(body.data.quantity, 1);
  });

  it('should increment the quantity when the item already exists (200)', async () => {
    await addItem(1);
    const { res, body } = await addItem(1);

    assert.equal(res.status, 200);
    assert.equal(body.data.quantity, 2); // 1 + 1, pas un remplacement
  });

  it('should reject an invalid body (negative quantity)', async () => {
    const res = await fetch(`${API_URL}/api/carts/items`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ treeId, projectId, quantity: -3 }),
    });
    const body = await res.json();

    // Body invalide -> ZodError -> 400 + VALIDATION_ERROR
    assert.equal(res.status, 400);
    assert.equal(body.error.code, 'VALIDATION_ERROR');
  });

  it('should reject a missing field', async () => {
    const res = await fetch(`${API_URL}/api/carts/items`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ treeId, quantity: 1 }),
    });
    const body = await res.json();

    assert.equal(res.status, 400);
    assert.equal(body.error.code, 'VALIDATION_ERROR');
  });

  it('should reject when the stock is exceeded', async () => {
    const res = await fetch(`${API_URL}/api/carts/items`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ treeId, projectId, quantity: treeStock + 1 }),
    });
    // Stock dépassé -> ValidationError (AppError métier, PAS une ZodError).
    // ⚠️ À ADAPTER : remplace par le status/code exacts définis dans
    // lib/errors.ts pour ValidationError (ex: assert.equal(res.status, 400)).
    assert.ok(res.status >= 400 && res.status < 500);
  });

  it('should return 404 for a non-existent tree/project pair', async () => {
    const res = await fetch(`${API_URL}/api/carts/items`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ treeId: 999999, projectId: 999999, quantity: 1 }),
    });
    const body = await res.json();

    assert.equal(res.status, 404);
    assert.equal(body.error.code, 'NOT_FOUND');
  });
});

// ------------------------------------------------------------
// PATCH /api/carts/items/:id
// ------------------------------------------------------------

describe('[PATCH] /api/carts/items/:id', () => {
  let itemId: number;

  beforeEach(async () => {
    await emptyCart();
    const { body } = await addItem(1);
    itemId = body.data.id;
  });

  it('should replace the quantity (200)', async () => {
    const res = await fetch(`${API_URL}/api/carts/items/${itemId}`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ quantity: 2 }),
    });
    const body = await res.json();

    assert.equal(res.status, 200);
    assert.equal(body.data.quantity, 2); // remplacement, pas incrément
  });

  it('should reject a quantity above the stock', async () => {
    const res = await fetch(`${API_URL}/api/carts/items/${itemId}`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ quantity: treeStock + 1 }),
    });
    assert.ok(res.status >= 400 && res.status < 500);
  });

  it('should return 404 for an item not in the user cart', async () => {
    const res = await fetch(`${API_URL}/api/carts/items/999999`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ quantity: 1 }),
    });
    const body = await res.json();

    assert.equal(res.status, 404);
    assert.equal(body.error.code, 'NOT_FOUND');
  });
});

// ------------------------------------------------------------
// DELETE /api/carts/items/:id
// ------------------------------------------------------------

describe('[DELETE] /api/carts/items/:id', () => {
  let itemId: number;

  beforeEach(async () => {
    await emptyCart();
    const { body } = await addItem(1);
    itemId = body.data.id;
  });

  it('should delete the item (200) and remove it from the cart', async () => {
    const res = await fetch(`${API_URL}/api/carts/items/${itemId}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    assert.equal(res.status, 200);

    // Vérifie que l'item a bien disparu du panier.
    const cart = await fetch(`${API_URL}/api/carts`, {
      headers: authHeaders(),
    }).then((r) => r.json());
    const found = cart.data.items.find((i: { id: number }) => i.id === itemId);
    assert.equal(found, undefined);
  });

  it('should return 404 for a non-existent item', async () => {
    const res = await fetch(`${API_URL}/api/carts/items/999999`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    const body = await res.json();

    assert.equal(res.status, 404);
    assert.equal(body.error.code, 'NOT_FOUND');
  });
});

// ------------------------------------------------------------
// DELETE /api/carts  (vider le panier)
// ------------------------------------------------------------

describe('[DELETE] /api/carts', () => {
  it('should empty the active cart (200)', async () => {
    await emptyCart();
    await addItem(1);

    const res = await fetch(`${API_URL}/api/carts`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    assert.equal(res.status, 200);

    // Le panier existe toujours mais ne contient plus d'items.
    const cart = await fetch(`${API_URL}/api/carts`, {
      headers: authHeaders(),
    }).then((r) => r.json());
    assert.equal(cart.data.items.length, 0);
  });
});

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

const API_URL = 'http://localhost:3002';

// ================================================================
// TESTS [GET] /api/trees
// ================================================================

describe('[GET] /api/trees', () => {
  // Vérifie que la première page retourne bien une liste d'arbres
  // avec les champs de pagination attendus
  it('should return first page of trees', async () => {
    const response = await fetch(`${API_URL}/api/trees`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.ok(Array.isArray(body.trees));
    assert.ok(body.trees.length > 0);
    assert.ok(typeof body.total === 'number');
    assert.equal(body.limit, 9);
  });

  // Vérifie que la pagination est bien respectée (max 9 arbres par page)
  it('should return at most 9 trees per page', async () => {
    const response = await fetch(`${API_URL}/api/trees?page=1`);
    const body = await response.json();

    assert.ok(body.trees.length <= 9);
  });

  // Vérifie que la page 2 contient des arbres différents de la page 1
  it('should return different trees on page 2', async () => {
    const [res1, res2] = await Promise.all([
      fetch(`${API_URL}/api/trees?page=1`),
      fetch(`${API_URL}/api/trees?page=2`),
    ]);

    const [body1, body2] = await Promise.all([res1.json(), res2.json()]);

    assert.equal(res2.status, 200);

    const ids1 = new Set(body1.trees.map((t: { id: number }) => t.id));
    const overlap = body2.trees.filter((t: { id: number }) => ids1.has(t.id));
    assert.equal(
      overlap.length,
      0,
      'Des arbres se répètent entre page 1 et page 2'
    );
  });

  // Vérifie que chaque arbre retourné contient les bons champs
  // et que les champs non sélectionnés sont absents
  it('should return correct shape for each tree', async () => {
    const response = await fetch(`${API_URL}/api/trees`);
    const body = await response.json();

    const tree = body.trees[0];
    assert.ok('id' in tree);
    assert.ok('commonName' in tree);
    assert.ok('family' in tree);
    assert.ok('origin' in tree);
    assert.ok('slug' in tree);
    assert.ok('picture' in tree);
    assert.ok('price' in tree);

    assert.ok(!('longDescription' in tree));
    assert.ok(!('scientificName' in tree));
  });

  // Vérifie qu'un filtre sans résultat retourne un tableau vide (pas une 404)
  it('should return empty array when filter has no results', async () => {
    const response = await fetch(`${API_URL}/api/trees?minPrice=99999`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.ok(Array.isArray(body.trees));
    assert.equal(body.trees.length, 0);
  });

  // Vérifie que le filtre par nom fonctionne (insensible à la casse)
  it('should filter trees by name', async () => {
    const response = await fetch(`${API_URL}/api/trees?search=chêne`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.ok(Array.isArray(body.trees));
    body.trees.forEach((t: { commonName: string }) => {
      assert.ok(
        t.commonName.toLowerCase().includes('chêne') ||
          t.commonName.toLowerCase().includes('chene'),
        `${t.commonName} ne correspond pas à la recherche`
      );
    });
  });

  // Vérifie que le filtre par fourchette de prix fonctionne
  it('should filter trees by price range', async () => {
    const response = await fetch(
      `${API_URL}/api/trees?minPrice=10&maxPrice=15`
    );
    const body = await response.json();

    assert.equal(response.status, 200);
    body.trees.forEach((t: { price: number }) => {
      assert.ok(
        t.price >= 10 && t.price <= 15,
        `Prix ${t.price} hors de la fourchette`
      );
    });
  });

  // Vérifie que le tri par prix croissant est bien appliqué
  it('should sort trees by price ascending', async () => {
    const response = await fetch(
      `${API_URL}/api/trees?sortBy=price&sortOrder=asc`
    );
    const body = await response.json();

    assert.equal(response.status, 200);
    const prices = body.trees.map((t: { price: number }) => t.price);
    const sorted = [...prices].sort((a, b) => a - b);
    assert.deepEqual(
      prices,
      sorted,
      'Les arbres ne sont pas triés par prix croissant'
    );
  });

  // Vérifie que le tri alphabétique est bien appliqué
  it('should sort trees alphabetically', async () => {
    const response = await fetch(
      `${API_URL}/api/trees?sortBy=commonName&sortOrder=asc`
    );
    const body = await response.json();

    assert.equal(response.status, 200);
    const names = body.trees.map((t: { commonName: string }) => t.commonName);
    const sorted = [...names].sort((a, b) => a.localeCompare(b, 'fr'));
    assert.deepEqual(
      names,
      sorted,
      'Les arbres ne sont pas triés alphabétiquement'
    );
  });
});

// ================================================================
// TESTS [GET] /api/trees/:slug
// ================================================================

describe('[GET] /api/trees/:slug', () => {
  // Récupère un slug réel depuis la liste puis vérifie le détail
  it('should return a tree by slug', async () => {
    const listResponse = await fetch(`${API_URL}/api/trees`);
    const listBody = await listResponse.json();
    const { slug } = listBody.trees[0];

    const response = await fetch(`${API_URL}/api/trees/${slug}`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.slug, slug);
  });

  // Vérifie qu'un slug inexistant retourne bien une 404
  it('should return 404 for unknown slug', async () => {
    const response = await fetch(`${API_URL}/api/trees/slug-inexistant`);
    const body = await response.json();

    assert.equal(response.status, 404);
    assert.equal(body.error.code, 'NOT_FOUND');
  });
});

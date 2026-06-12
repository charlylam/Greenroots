import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

const API_URL = 'http://localhost:3002';

describe('[GET] /api/projects', () => {
  it('should return all projects without pagination', async () => {
    const response = await fetch(`${API_URL}/api/projects`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.ok(Array.isArray(body.projects));
    assert.ok(body.projects.length > 0);
    // Pas de total ni limit dans ce cas
    assert.equal(body.total, undefined);
    assert.equal(body.limit, undefined);
  });
  it('should return first page of projects', async () => {
    const response = await fetch(`${API_URL}/api/projects?page=1`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.ok(Array.isArray(body.projects));
    assert.ok(body.projects.length > 0);
    assert.ok(typeof body.total === 'number');
    assert.equal(body.limit, 6);
  });

  it('should return at most 6 projects per page', async () => {
    const response = await fetch(`${API_URL}/api/projects?page=1`);
    const body = await response.json();

    assert.ok(body.projects.length <= 6);
  });

  it('should return different projects on page 2', async () => {
    const [res1, res2] = await Promise.all([
      fetch(`${API_URL}/api/projects?page=1`),
      fetch(`${API_URL}/api/projects?page=2`),
    ]);

    const [body1, body2] = await Promise.all([res1.json(), res2.json()]);

    assert.equal(res2.status, 200);

    // Aucun projet de la page 2 ne doit apparaître en page 1
    const ids1 = new Set(body1.projects.map((p: { id: number }) => p.id));
    const overlap = body2.projects.filter((p: { id: number }) =>
      ids1.has(p.id)
    );
    assert.equal(
      overlap.length,
      0,
      'Des projets se répètent entre page 1 et page 2'
    );
  });

  it('should return correct shape for each project', async () => {
    const response = await fetch(`${API_URL}/api/projects`);
    const body = await response.json();

    const project = body.projects[0];
    assert.ok('id' in project);
    assert.ok('name' in project);
    assert.ok('shortDescription' in project);
    assert.ok('slug' in project);
    assert.ok('localisation' in project);
    assert.ok('picture' in project);
    assert.ok('progress' in project);

    // Vérifie que les champs non sélectionnés sont absents
    assert.ok(!('createdAt' in project));
  });

  it('should return 404 when page is out of range', async () => {
    const response = await fetch(`${API_URL}/api/projects?page=99999`);
    const body = await response.json();

    assert.equal(response.status, 404);
    assert.equal(body.error.code, 'NOT_FOUND');
  });
});

describe('[GET] /api/projects/:slug', () => {
  it('should return a project by slug', async () => {
    // Récupère un slug réel depuis le seed
    const listResponse = await fetch(`${API_URL}/api/projects`);
    const listBody = await listResponse.json();
    const { slug } = listBody.projects[0];

    const response = await fetch(`${API_URL}/api/projects/${slug}`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.slug, slug);
  });

  it('should return 404 for unknown slug', async () => {
    const response = await fetch(`${API_URL}/api/projects/slug-inexistant`);
    const body = await response.json();

    assert.equal(response.status, 404);
    assert.equal(body.error.code, 'NOT_FOUND');
  });
});

describe('[GET] /api/projects/:slug/trees', () => {
  it('should return trees with stock for a valid project', async () => {
    const listResponse = await fetch(`${API_URL}/api/projects`);
    const listBody = await listResponse.json();
    const { slug } = listBody.projects[0];

    const response = await fetch(`${API_URL}/api/projects/${slug}/trees`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.ok(Array.isArray(body.trees));
    assert.ok(typeof body.total === 'number');
    assert.equal(body.limit, 6);

    // Vérifie que le stock est bien fusionné sur chaque arbre
    const tree = body.trees[0];
    assert.ok('stock' in tree);
  });

  it('should return 404 for unknown project slug', async () => {
    const response = await fetch(
      `${API_URL}/api/projects/slug-inexistant/trees`
    );
    const body = await response.json();

    assert.equal(response.status, 404);
    assert.equal(body.error.code, 'NOT_FOUND');
  });

  it('should return at most 6 trees per page', async () => {
    const listResponse = await fetch(`${API_URL}/api/projects`);
    const listBody = await listResponse.json();
    const { slug } = listBody.projects[0];

    const response = await fetch(
      `${API_URL}/api/projects/${slug}/trees?page=1`
    );
    const body = await response.json();

    assert.ok(body.trees.length <= 6);
  });
});

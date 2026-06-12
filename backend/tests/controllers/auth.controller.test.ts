import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import jwt, { type JwtPayload } from 'jsonwebtoken';

// URL de l'API de test. Le serveur doit être démarré localement sur ce port.
const API_URL = 'http://localhost:3002';

// Groupe de tests pour l'endpoint de connexion.
describe('[POST] /api/auth/login', () => {
  it('should login admin with valid credentials', async () => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@greenroots.fr',
        password: 'Password123@',
      }),
    });

    const body = await response.json();

    assert.equal(response.status, 200);
    assert.ok(body.token);

    const payload = jwt.decode(body.token) as JwtPayload;

    // Vérifie que le JWT contient bien les informations attendues.
    assert.ok(payload.userId);
    assert.equal(payload.role, 'admin');
  });

  it('should login seeded user with valid credentials', async () => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'thomas.martin@email.fr',
        password: 'Password123@',
      }),
    });

    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.user.email, 'thomas.martin@email.fr');
    assert.equal(body.user.role, 'user');
    assert.ok(body.token);
  });

  it('should return 401 with wrong password', async () => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@greenroots.fr',
        password: 'wrongpassword',
      }),
    });

    const body = await response.json();

    assert.equal(response.status, 401);
    assert.equal(body.error.code, 'UNAUTHORIZED');
  });

  it('should return 401 with unknown email', async () => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'unknown@email.fr',
        password: 'Password123@',
      }),
    });

    const body = await response.json();

    assert.equal(response.status, 401);
    assert.equal(body.error.code, 'UNAUTHORIZED');
  });
});

// Groupe de tests pour l'endpoint qui retourne l'utilisateur connecté.
describe('[GET] /api/users/me', () => {
  it('should return current user when token is valid', async () => {
    const loginResponse = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@greenroots.fr',
        password: 'Password123@',
      }),
    });

    const loginBody = await loginResponse.json();

    const response = await fetch(`${API_URL}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${loginBody.token}`,
      },
    });

    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.data.email, 'admin@greenroots.fr');
    assert.equal(body.data.role, 'admin');
  });

  it('should return 401 when authorization header is missing', async () => {
    const response = await fetch(`${API_URL}/api/users/me`);

    const body = await response.json();

    assert.equal(response.status, 401);
    assert.equal(body.error.code, 'UNAUTHORIZED');
  });

  it('should return 401 when token is invalid', async () => {
    const response = await fetch(`${API_URL}/api/users/me`, {
      headers: {
        Authorization: 'Bearer invalid-token',
      },
    });

    const body = await response.json();

    assert.equal(response.status, 401);
    assert.equal(body.error.code, 'UNAUTHORIZED');
  });
});

// Groupe de tests pour l'endpoint d'inscription.
describe('[POST] /api/auth/register', () => {
  it('should create a new particulier account', async () => {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'Test',
        lastName: 'NodeTest',
        email: `test-${Date.now()}@email.fr`,
        password: 'Password123@',
        address: '1 rue du Test',
        postalCode: '01000',
        city: 'Bourg-en-Bresse',
        type: 'particulier',
        acceptedTerms: true,
      }),
    });

    const body = await response.json();

    assert.equal(response.status, 201);
    assert.equal(body.message, 'Account created successfully');
    assert.equal(body.user.type, 'particulier');
  });

  it('should return 409 when email already exists', async () => {
    const email = `duplicate-${Date.now()}@email.fr`;

    await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'Duplicate',
        lastName: 'User',
        email,
        password: 'Password123@',
        address: '1 rue du Test',
        postalCode: '01000',
        city: 'Bourg-en-Bresse',
        type: 'particulier',
        acceptedTerms: true,
      }),
    });

    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'Duplicate',
        lastName: 'User',
        email,
        password: 'Password123@',
        address: '1 rue du Test',
        postalCode: '01000',
        city: 'Bourg-en-Bresse',
        type: 'particulier',
        acceptedTerms: true,
      }),
    });

    const body = await response.json();

    assert.equal(response.status, 409);
    assert.equal(body.error.code, 'CONFLICT');
  });

  it('should return 409 when siret already exists', async () => {
    const siret = `${Date.now()}`.slice(0, 14).padEnd(14, '0');

    await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'Entreprise',
        lastName: 'Test',
        email: `entreprise-${Date.now()}@email.fr`,
        password: 'Password123@',
        address: '1 rue du Test',
        postalCode: '01000',
        city: 'Bourg-en-Bresse',
        type: 'entreprise',
        siret,
        companyName: 'Entreprise Test',
        acceptedTerms: true,
      }),
    });

    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'Entreprise',
        lastName: 'Duplicate',
        email: `entreprise-duplicate-${Date.now()}@email.fr`,
        password: 'Password123@',
        address: '1 rue du Test',
        postalCode: '01000',
        city: 'Bourg-en-Bresse',
        type: 'entreprise',
        siret,
        companyName: 'Entreprise Duplicate',
        acceptedTerms: true,
      }),
    });

    const body = await response.json();

    assert.equal(response.status, 409);
    assert.equal(body.error.code, 'CONFLICT');
  });

  it('should return 400 when entreprise has no siret', async () => {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'Entreprise',
        lastName: 'Test',
        email: `entreprise-${Date.now()}@email.fr`,
        password: 'Password123@',
        address: '1 rue du Test',
        postalCode: '01000',
        city: 'Bourg-en-Bresse',
        type: 'entreprise',
        acceptedTerms: true,
      }),
    });

    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.error.code, 'VALIDATION_ERROR');
  });
});

import { cookies } from 'next/headers';
import { ApiError } from './errors';
import { Cart, Project } from '@/types';

// ================================================================
// MODULE DE CENTRALISATION DES APPELS API
// ================================================================
// Ce fichier centralise tous les appels vers l'API backend.
// Il fournit des fonctions réutilisables pour :
// - Les requêtes publiques (apiFetch)
// - Les requêtes authentifiées avec token (apiFetchPrivate)
// - Les appels spécifiques

// URL de base de l'API backend récupérée des variables d'environnement
const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Fonction de base pour effectuer des appels API publics.
 * @param endpoint - Le chemin de l'endpoint (ex: '/api/projects')
 * @param options - Options fetch optionnelles (method, headers, body, etc.)
 * @returns Réponse JSON parsée de l'API
 * @throws Erreur si la réponse n'est pas ok (status >= 400)
 */
export async function apiFetch(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${API_URL}${endpoint}`, options);

  // Si le backend renvoie un code d'erreur HTTP (>= 400), on traite la réponse
  if (!response.ok) {
    let errorBody;

    // On essaye de parser le corps de la réponse en JSON pour récupérer
    // un message d'erreur structuré envoyé par l'API.
    try {
      errorBody = await response.json();
    } catch {
      // Si la réponse n'est pas du JSON valide, on logge quand même le statut.
      console.error(
        `Réponse non-JSON pour ${endpoint} (status ${response.status})`
      );
    }

    // On privilégie le message d'erreur détaillé renvoyé par l'API,
    // sinon on construit un message générique avec le statut HTTP.
    const message =
      errorBody?.error?.message ?? `Erreur API: ${response.status}`;

    // On lance une erreur structurée pour que l'appelant puisse l'intercepter
    // et afficher un message clair à l'utilisateur.
    throw new ApiError(message, response.status, errorBody?.error?.code);
  }

  // 👇 ICI, à la place de l'ancien `return response.json();`
  // Certaines réponses (DELETE → 204 No Content, ou 200 sans corps) n'ont pas
  // de JSON à parser. On évite que response.json() lève une erreur sur un corps vide.
  if (
    response.status === 204 ||
    response.headers.get('content-length') === '0'
  ) {
    return null;
  }

  return response.json();
}

/**
 * Récupère le token JWT stocké dans les cookies de la session.
 * @returns Le token JWT ou undefined s'il n'existe pas
 */
async function getToken() {
  const token = (await cookies()).get('token')?.value;
  return token;
}

/**
 * Fonction pour effectuer des appels API privés/authentifiés.
 * Ajoute automatiquement le token JWT dans l'en-tête Authorization.
 * @param endpoint - Le chemin de l'endpoint
 * @param options - Options fetch optionnelles
 * @returns Réponse JSON parsée de l'API
 */
export async function apiFetchPrivate(endpoint: string, options?: RequestInit) {
  const headers = {
    ...options?.headers,
    Authorization: `Bearer ${await getToken()}`,
  };
  return apiFetch(endpoint, { ...options, headers });
}

// ================================================================
// ROUTES PUBLIQUES
// ================================================================

/**
 * Récupère la liste paginée des projets.
 * @param currentPage - Numéro de la page
 * @returns Liste des projets de la page demandée
 */
export async function getProjects(
  currentPage?: number,
  localisation?: string,
  search?: string,
  sortBy?: string,
  sortOrder?: string
): Promise<{ projects: Project[]; total: number; limit: number }> {
  if (!currentPage) {
    return apiFetch(`/api/projects`);
  }
  const params = new URLSearchParams({ page: String(currentPage) });
  if (localisation) params.append('localisation', localisation);
  if (search) params.append('search', search);
  if (sortBy) params.append('sortBy', sortBy);
  if (sortOrder) params.append('sortOrder', sortOrder);

  return apiFetch(`/api/projects?${params}`);
}

/**
 * Récupère la liste des localisations disponibles pour les projets.
 * Utilisé pour remplir le filtre de localisation côté frontend.
 * @returns Liste des localisations
 */
export async function getProjectsLocalisations() {
  return apiFetch(`/api/projects/localisations`);
}

/**
 * Récupère les détails d'un projet spécifique.
 * @param slug - Identifiant/slug du projet
 * @returns Données du projet
 */
export async function getOneProject(slug: string) {
  return apiFetch(`/api/projects/${slug}`);
}

/**
 * Récupère la liste paginée des arbres d'un projet.
 * @param slug - Identifiant/slug du projet
 * @param currentPage - Numéro de la page
 * @returns Liste des arbres du projet
 */
export async function getProjectTrees(slug: string, currentPage: number) {
  return apiFetch(`/api/projects/${slug}/trees?page=${currentPage}`);
}

/**
 * Récupère TOUS les arbres en parcourant toutes les pages.
 * Utilisé pour le sitemap (build / revalidation), pas pour l'affichage.
 * @returns Tableau complet de tous les arbres
 */
export async function getAllTrees() {
  const allTrees = [];
  let currentPage = 1;

  while (true) {
    const { trees } = await getTrees(currentPage);

    // Plus rien à récupérer → on sort
    if (!trees || trees.length === 0) break;

    allTrees.push(...trees);
    currentPage++;
  }

  return allTrees;
}

/**
 * Récupère la liste paginée des arbres.
 * @param currentPage - Numéro de la page
 * @returns Liste des arbres de la page demandée
 */
export async function getTrees(
  currentPage: number = 1,
  filters?: {
    search?: string;
    minPrice?: string;
    maxPrice?: string;
    sortBy?: string;
    sortOrder?: string;
  }
) {
  const params = new URLSearchParams();
  params.set('page', String(currentPage));
  if (filters?.search) params.set('search', filters.search);
  if (filters?.minPrice) params.set('minPrice', filters.minPrice);
  if (filters?.maxPrice) params.set('maxPrice', filters.maxPrice);
  if (filters?.sortBy) params.set('sortBy', filters.sortBy);
  if (filters?.sortOrder) params.set('sortOrder', filters.sortOrder);
  return apiFetch(`/api/trees?${params.toString()}`);
}

/**
 * Récupère les détails d'un arbre spécifique.
 * @param slug - Identifiant/slug de l'arbre
 * @returns Données de l'arbre
 */
export async function getOneTree(slug: string) {
  return apiFetch(`/api/trees/${slug}`, { cache: 'no-store' });
}

// --- USER ---

/** GET /api/users/me — récupère le profil de l'utilisateur connecté. */
export async function getMe() {
  return apiFetchPrivate(`/api/users/me`);
}

/** PUT /api/users/me — modifie partiellement les informations du user connecté. */
export async function updateMe(body: Record<string, unknown>) {
  return apiFetchPrivate(`/api/users/me`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

/** DELETE /api/users/me — supprime (anonymise) le compte du user connecté. */
export async function deleteMe() {
  return apiFetchPrivate(`/api/users/me`, {
    method: 'DELETE',
  });
}

/** GET /api/users/me/orders — historique des commandes du user connecté. */
export async function getMyOrders() {
  return apiFetchPrivate(`/api/users/me/orders`);
}

/** GET /api/users/me/orders/:id — détail d'une commande spécifique. */
export async function getMyOrder(id: number) {
  return apiFetchPrivate(`/api/users/me/orders/${id}`);
}

// --- ORDER ---

/** POST /api/orders — convertit le panier actif en commande. */
export async function createOrder() {
  return apiFetchPrivate(`/api/orders`, {
    method: 'POST',
  });
}

/** POST /api/payment/checkout-session — crée une session Stripe Checkout pour le panier actif. */
export async function createCheckoutSession() {
  return apiFetchPrivate(`/api/payment/checkout-session`, {
    method: 'POST',
  });
}

// --- CART ---

export async function getCart(): Promise<{
  data: Cart;
  meta: { total: number };
}> {
  return apiFetchPrivate(`/api/carts`);
}

export async function addToCart(
  treeId: number,
  projectId: number,
  quantity: number
) {
  return apiFetchPrivate(`/api/carts/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ treeId, projectId, quantity }),
  });
}

export async function changeCartItemQuantity(
  cartItemId: number,
  quantity: number
) {
  return apiFetchPrivate(`/api/carts/items/${cartItemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity }),
  });
}

export async function deleteCartItem(cartItemId: number) {
  return apiFetchPrivate(`/api/carts/items/${cartItemId}`, {
    method: 'DELETE',
  });
}

export async function clearCart() {
  return apiFetchPrivate(`/api/carts`, {
    method: 'DELETE',
  });
}

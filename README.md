# 🌱 GreenRoots

GreenRoots est une plateforme e-commerce dédiée à la reforestation. Elle permet aux particuliers, entreprises et associations d'acheter des arbres qui seront plantés via des projets de reforestation à travers le monde.

## À propos

Née de l'urgence d'agir concrètement contre la déforestation et le changement climatique, GreenRoots met en relation les acheteurs avec des projets de reforestation. Chaque arbre acheté contribue directement à un projet de plantation précis et traçable.

## Fonctionnalités

### Pour les utilisateurs

- 🌳 Parcourir et filtrer arbres et projets de reforestation (recherche, prix, localisation, tri)
- 📖 Consulter les informations détaillées de chaque espèce d'arbre et de chaque projet
- 🛒 Ajouter des arbres au panier et passer commande (checkout avec décrémentation atomique du stock)
- 📦 Consulter l'historique de ses commandes depuis l'espace client
- 👤 Inscription/connexion sécurisée (JWT en cookie httpOnly)
- ✉️ Notifications par email (inscription, confirmation de commande, suppression de compte)
- 🗑️ Suppression de compte avec **anonymisation conditionnelle RGPD** (hard delete si pas de commande, anonymisation sinon)
- ❓ Page 404 personnalisée

### Pour les administrateurs

- 🛠️ Interface admin (EJS server-side) pour gérer arbres, projets et utilisateurs
- 📊 Dashboard avec tri/filtres
- 🖼️ Upload d'images (multer + stockage backend)

### Conformité et bonnes pratiques

- 🍪 Gestion des cookies conforme RGPD via TarteAuCitron
- 🤖 SEO complet : metadata par page, sitemap.xml dynamique, robots.txt
- 📚 Documentation API Swagger sur `/api-docs`

## Sommaire

- [🌱 GreenRoots](#-greenroots)
  - [À propos](#à-propos)
  - [Fonctionnalités](#fonctionnalités)
    - [Pour les utilisateurs](#pour-les-utilisateurs)
    - [Pour les administrateurs](#pour-les-administrateurs)
    - [Conformité et bonnes pratiques](#conformité-et-bonnes-pratiques)
  - [Sommaire](#sommaire)
  - [Stack technique](#stack-technique)
  - [Structure du projet](#structure-du-projet)
  - [Prérequis](#prérequis)
  - [Installation](#installation)
  - [Lancer l'environnement de développement](#lancer-lenvironnement-de-développement)
    - [Avec Docker (recommandé pour le backend)](#avec-docker-recommandé-pour-le-backend)
    - [Frontend (hors Docker)](#frontend-hors-docker)
  - [Variables d'environnement](#variables-denvironnement)
    - [Racine — `.env`](#racine--env)
    - [Backend — `backend/.env`](#backend--backendenv)
    - [Frontend — `frontend/.env`](#frontend--frontendenv)
  - [Base de données (Prisma)](#base-de-données-prisma)
    - [Prisma Studio](#prisma-studio)
  - [Documentation API (Swagger)](#documentation-api-swagger)
  - [Qualité de code](#qualité-de-code)
    - [Formatage — Prettier](#formatage--prettier)
    - [Lint — ESLint](#lint--eslint)
    - [Hooks Git — Husky](#hooks-git--husky)
    - [Convention de commits](#convention-de-commits)
  - [Workflow Git](#workflow-git)
  - [Tests automatisés](#tests-automatisés)
    - [Tests backend](#tests-backend)
    - [Tests frontend](#tests-frontend)
    - [Intégration continue](#intégration-continue)
  - [Workflow après un pull DEV](#workflow-après-un-pull-dev)
  - [Notes RGPD](#notes-rgpd)
    - [Suppression de compte conditionnelle](#suppression-de-compte-conditionnelle)
    - [Gestion des cookies](#gestion-des-cookies)
    - [SEO et exclusion des pages privées](#seo-et-exclusion-des-pages-privées)

## Stack technique

| Couche                   | Technologie                               |
| ------------------------ | ----------------------------------------- |
| Frontend                 | Next.js 16 (App Router) + React 19        |
| Styles                   | Tailwind CSS 4 + shadcn/ui                |
| API                      | Node.js 24 + Express 5                    |
| Admin (back-office)      | EJS (server-side rendering)               |
| ORM                      | Prisma 7 (adapter `pg`)                   |
| Base de données          | PostgreSQL 17 (alpine)                    |
| Langage                  | TypeScript                                |
| Conteneurisation         | Docker + Docker Compose                   |
| Validation des données   | Zod                                       |
| Authentification         | JWT (cookie httpOnly) + Argon2            |
| Email transactionnel     | Brevo (ex-Sendinblue)                     |
| Email formulaire contact | EmailJS                                   |
| Documentation API        | Swagger UI + OpenAPI 3.0 (YAML modulaire) |
| Tests backend            | node:test + tsx                           |
| Tests frontend           | Vitest + React Testing Library            |
| SEO                      | Metadata API + sitemap.ts + robots.ts     |
| Cookies/Consentement     | TarteAuCitron                             |
| Hooks Git                | Husky + lint-staged + commitlint          |
| Formatage / Lint         | Prettier + ESLint                         |

## Structure du projet

```
projet-cda-GreenRoots/
├── backend/                       # API Express + admin EJS
│   ├── src/
│   │   ├── server.ts              # Démarrage du serveur
│   │   ├── app.ts                 # Configuration Express + Swagger
│   │   ├── @types/                # Types TypeScript partagés
│   │   ├── controllers/           # Contrôleurs des routes
│   │   │   ├── admin/             # Contrôleurs admin (back-office EJS)
│   │   │   ├── auth.controller.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── cart.controller.ts
│   │   │   ├── order.controller.ts
│   │   │   ├── project.controller.ts
│   │   │   └── trees.controller.ts
│   │   ├── docs/                  # Documentation OpenAPI modulaire
│   │   │   ├── openapi.yaml       # Fichier racine (combine via $ref)
│   │   │   ├── users.openapi.yaml
│   │   │   ├── orders.openapi.yaml
│   │   │   ├── carts.openapi.yaml
│   │   │   ├── trees.openapi.yaml
│   │   │   └── projects.openapi.yaml
│   │   ├── lib/                   # Utilitaires (Prisma client, errors)
│   │   ├── middlewares/           # Middlewares Express (auth, upload, errorHandler)
│   │   ├── services/              # Services métier (mail.service.ts)
│   │   ├── validators/            # Schémas Zod (validation des inputs)
│   │   └── routers/               # Définition des routes
│   ├── prisma/
│   │   ├── schema.prisma          # Schéma Prisma
│   │   ├── migrations/            # Migrations versionnées
│   │   └── seeding/seed.ts        # Données de seed
│   ├── public/uploads/seed/       # Images du catalogue (versionnées)
│   ├── views/admin/               # Vues EJS du back-office
│   ├── tests/                     # Tests backend (node:test)
│   ├── Dockerfile
│   └── package.json
│
├── frontend/                      # Application Next.js
│   ├── src/
│   │   ├── app/                   # App Router (pages, layouts, API routes)
│   │   │   ├── api/auth/          # Routes API internes (login, logout, delete-account)
│   │   │   ├── arbres/            # Page catalogue arbres
│   │   │   ├── projets/           # Page catalogue projets
│   │   │   ├── panier/            # Page panier
│   │   │   ├── espace-client/     # Espace utilisateur
│   │   │   ├── authentification/  # Connexion/Inscription
│   │   │   ├── contact/           # Formulaire contact
│   │   │   ├── not-found.tsx      # Page 404 custom
│   │   │   ├── sitemap.ts         # Sitemap dynamique
│   │   │   └── robots.ts          # robots.txt dynamique
│   │   ├── components/            # Composants React
│   │   ├── lib/                   # Helpers (api.ts, format.ts, images.ts)
│   │   └── proxy.ts               # Middleware Next.js 16 (auth gate)
│   ├── tests/                     # Tests frontend (Vitest + RTL)
│   │   ├── setup.tsx              # Mocks globaux Next.js
│   │   └── components/            # Tests des composants
│   ├── public/                    # Assets statiques (images marque, favicon)
│   ├── vitest.config.ts
│   └── package.json
│
├── .github/
│   └── workflows/
│       └── backend-ci.yml         # CI GitHub Actions (lint + typecheck + tests)
│
├── .husky/                        # Hooks Git (pre-commit, commit-msg)
├── docker-compose.dev.yml         # Stack de dev (db + db-test + backend + backend-test)
├── commitlint.config.js           # Règles Conventional Commits
└── package.json                   # Scripts racine (workspace)
```

## Prérequis

- **Docker** + **Docker Compose** (pour la stack dev)
- **Node.js 24+** (pour le frontend + outils locaux)
- **npm** (livré avec Node)

## Installation

1. Cloner le dépôt :

   ```bash
   git clone git@github.com:O-clock-Helsinki/projet-cda-GreenRoots.git
   cd projet-cda-GreenRoots
   ```

2. Copier les fichiers d'environnement :

   ```bash
   cp .env.example .env
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

   Adapte les valeurs (notamment `POSTGRES_PASSWORD`, `JWT_SECRET`, variables Brevo, EmailJS).

3. Installer les dépendances :
   ```bash
   npm run install:all
   ```

## Lancer l'environnement de développement

### Avec Docker (recommandé pour le backend)

Lance la base PostgreSQL et l'API backend (dev + test) :

```bash
docker compose -f docker-compose.dev.yml up -d
```

| Service               | URL / Port                     | Description                |
| --------------------- | ------------------------------ | -------------------------- |
| API backend           | http://localhost:3001          | API REST + admin EJS       |
| Backend de test       | http://localhost:3002          | Conteneur dédié aux tests  |
| Documentation Swagger | http://localhost:3001/api-docs | Swagger UI                 |
| Admin EJS             | http://localhost:3001/admin    | Back-office (login requis) |
| PostgreSQL (dev)      | `localhost:5432`               | Base principale            |
| PostgreSQL (test)     | `localhost:5433`               | Base de tests              |

Le code du backend est monté en volume — modifications rechargées à chaud grâce à `tsx watch`.

Pour arrêter :

```bash
docker compose -f docker-compose.dev.yml down
```

Pour tout réinitialiser (incluant volumes de données) :

```bash
docker compose -f docker-compose.dev.yml down -v
```

### Frontend (hors Docker)

Le frontend Next.js n'est pas conteneurisé :

```bash
cd frontend
npm run dev
```

→ http://localhost:3000

## Variables d'environnement

### Racine — `.env`

Utilisé par `docker-compose.dev.yml`. Variables référencées via `${VAR}` dans le YAML.

```env
# Base PostgreSQL
POSTGRES_USER=greenroots
POSTGRES_PASSWORD=your_password
POSTGRES_DB=greenroots
DATABASE_URL="postgresql://greenroots:your_password@db:5432/greenroots"

# Base de test
POSTGRES_TEST_USER=greenroots
POSTGRES_TEST_PASSWORD=testpassword
POSTGRES_TEST_DB=greenroots_test
TEST_DATABASE_URL="postgresql://greenroots:testpassword@db-test:5432/greenroots_test"

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d

# Brevo (envoi d'emails transactionnels)
MAIL_HOST=smtp-relay.brevo.com
MAIL_PORT=587
MAIL_USER=your_brevo_user
MAIL_PASSWORD=your_brevo_password
MAIL_FROM=GreenRoots <noreply@greenroots.fr>
```

### Backend — `backend/.env`

Voir `backend/.env.example`. Sert pour les commandes Node lancées directement depuis le Mac (Prisma Studio, etc.).

### Frontend — `frontend/.env`

```env
# URL du backend
NEXT_PUBLIC_API_URL=http://localhost:3001

# EmailJS (formulaire de contact)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key

# Indexation SEO (false en staging, true en prod)
NEXT_PUBLIC_ALLOW_INDEXING=false
```

## Base de données (Prisma)

Les commandes Prisma sont à lancer dans le conteneur backend.

| Commande Docker                                                                          | Description                                    |
| ---------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `docker compose -f docker-compose.dev.yml exec backend npx prisma generate`              | Régénère le client Prisma                      |
| `docker compose -f docker-compose.dev.yml exec backend npx prisma migrate dev`           | Crée et applique une nouvelle migration        |
| `docker compose -f docker-compose.dev.yml exec backend npx prisma migrate deploy`        | Applique les migrations existantes (sans seed) |
| `docker compose -f docker-compose.dev.yml exec backend npx prisma migrate reset --force` | Reset complet + seed                           |
| `docker compose -f docker-compose.dev.yml exec backend npm run db:seed`                  | Lance uniquement le seed                       |

### Prisma Studio

Lancement local :

```bash
cd backend
npx prisma studio --port 5557
```

→ Interface web accessible sur http://localhost:5557 (la `DATABASE_URL` doit pointer sur `localhost:5432`).

## Documentation API (Swagger)

L'API REST est documentée avec **OpenAPI 3.0** au format YAML modulaire.

- **Accès** : http://localhost:3001/api-docs
- **Architecture** : un fichier `openapi.yaml` racine qui agrège les fichiers par scope via `$ref` :
  - `users.openapi.yaml` (Auth + Users)
  - `orders.openapi.yaml` (Orders)
  - `carts.openapi.yaml` (Carts)
  - `trees.openapi.yaml` (Trees)
  - `projects.openapi.yaml` (Projects)

- **Auth Bearer** : chaque route protégée déclare `security: [{ bearerAuth: [] }]`. Tu peux tester depuis Swagger UI :
  1. Bouton **"Authorize"**
  2. Colle le JWT
  3. Toutes les requêtes incluent désormais le header `Authorization: Bearer <token>`

## Qualité de code

### Formatage — Prettier

Configuration : `.prettierrc`. Formatage appliqué automatiquement au commit via `lint-staged`.

### Lint — ESLint

- Backend : `backend/eslint.config.mjs`
- Frontend : `frontend/eslint.config.mjs` (`npm run lint`)

### Hooks Git — Husky

Hooks dans `.husky/` :

- **pre-commit** : `lint-staged` (formatage + lint des fichiers stagés)
- **commit-msg** : validation par `commitlint` selon Conventional Commits

### Convention de commits

Types courants : `feat`, `fix`, `build`, `chore`, `docs`, `style`, `refactor`, `test`, `perf`, `ci`.

## Workflow Git

- Branche principale : `main`
- Branche d'intégration : `DEV`
- Branches de feature : `feat/<nom>`, `fix/<nom>`, `docs/<nom>`, `chore/<nom>`, etc.

Workflow type :

1. Créer une branche depuis `DEV` :
   ```bash
   git checkout DEV
   git pull origin DEV
   git checkout -b feat/ma-feature
   ```
2. Coder + commit (les hooks valident automatiquement)
3. Pousser :
   ```bash
   git push -u origin feat/ma-feature
   ```
4. Ouvrir une **Pull Request vers `DEV`** sur GitHub
5. Après review et merge → la CI tourne automatiquement

## Tests automatisés

### Tests backend

67 tests couvrant : auth, users, carts, orders, projects, trees, middlewares, validators.

**Lancement en local** :

```bash
# Reset + seed de la base de test
docker compose -f docker-compose.dev.yml exec backend-test npx prisma migrate reset --force

# Lancer la suite
docker compose -f docker-compose.dev.yml exec backend-test npm test
```

**Lint et typecheck** :

```bash
docker compose -f docker-compose.dev.yml exec backend-test npm run lint
docker compose -f docker-compose.dev.yml exec backend-test npm run typecheck
```

**Accès au conteneur de test** (debug) :

```bash
docker exec -it greenroots-backend-test sh
```

### Tests frontend

Tests unitaires/composants avec **Vitest + React Testing Library** .

```bash
cd frontend
npm test         # mode watch
npm run test:run # une seule exécution (CI)
```

Mocks globaux Next.js dans `frontend/tests/setup.tsx` :

- `next/link` → `<a>` simple
- `next/navigation` → router/pathname factices
- `next/image` → `<img>` avec filtrage des props Next.js

### Intégration continue

À chaque push et chaque PR vers `DEV`, GitHub Actions (`.github/workflows/backend-ci.yml`) exécute :

1. Démarrage des conteneurs Docker
2. Reset + seed de la base de test
3. Vérification ESLint
4. Vérification TypeScript
5. Exécution de la suite de tests backend

→ Tests **frontend** : à lancer manuellement avant chaque PR (pas encore en CI).

## Workflow après un pull DEV

Quand tu pull `DEV`, certains changements imposent des actions :

| Si...                            | Action                                                                  |
| -------------------------------- | ----------------------------------------------------------------------- |
| `package.json` modifié           | `docker exec greenroots-backend npm install` (idem pour `backend-test`) |
| `schema.prisma` modifié          | `docker compose exec backend npx prisma generate` + `migrate deploy`    |
| `.env.example` modifié           | Mettre à jour ton `.env` local                                          |
| `docker-compose.dev.yml` modifié | `docker compose up -d --build`                                          |
| Code TS uniquement               | Rien (tsx watch + hot reload)                                           |

## Notes RGPD

La plateforme implémente plusieurs mesures de conformité RGPD :

### Suppression de compte conditionnelle

`DELETE /api/users/me` applique une logique adaptée selon l'historique de l'utilisateur :

- **Utilisateur sans commande** → suppression complète du compte (hard delete). Le panier est supprimé en cascade (`onDelete: Cascade`).
- **Utilisateur avec au moins une commande** → anonymisation : email remplacé par `deleted-{id}@anonymized.local`, nom/prénom devient `Anonyme/Utilisateur`, adresse vidée. Les commandes sont préservées pour la traçabilité comptable (`onDelete: Restrict` sur `Order.user`).

Dans les deux cas :

- Le panier actif est supprimé
- Le login est refusé (le contrôleur d'auth vérifie `deletedAt`)
- Un email de confirmation est envoyé

### Gestion des cookies

La gestion du consentement est assurée par **TarteAuCitron.js** (conformité CNIL).

- Bandeau au premier chargement (configurable `highPrivacy: true`)
- Bouton "Gestion des cookies" dans le footer pour rouvrir le panneau
- Cookie de consentement nommé `greenroots-consent`

### SEO et exclusion des pages privées

- Variable `NEXT_PUBLIC_ALLOW_INDEXING=false` en staging pour exclure du moteur de recherche
- Pages privées (panier, espace client, 404) marquées `noindex` explicitement, même si l'indexation globale est activée

---

> GreenRoots est un projet fictif créé à des fins pédagogiques (CDA — Concepteur Développeur d'Applications, O'clock).

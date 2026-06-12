import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import { errorHandler } from './middlewares/errorHandler.js';
import { router } from './routers/index.router.js';
import searchRouter from './routers/search.router.js';
import { adminRouter } from './routers/admin.router.js';
// import { router as stripeWebhookRouter } from './routers/stripe-webhook.router.js';

import swaggerUi from 'swagger-ui-express';
import SwaggerParser from '@apidevtools/swagger-parser';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const swaggerDocument = await SwaggerParser.bundle(
  path.join(__dirname, 'docs/openapi.yaml')
);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Activation de CORS pour autoriser les appels du front-end vers l'API.
// FRONTEND_URL permet d'adapter l'origine autorisée selon l'environnement.
// credentials: true est indispensable pour envoyer les cookies d'authentification.
const allowedOrigins: string[] = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

app.use(cors(corsOptions));

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false, // Autorise le chargement des ressources statiques cross-origin
  })
);

// Route dédiée aux webhooks Stripe.
// Elle reçoit les événements envoyés par Stripe après un paiement,
// sans passer par les routes API classiques, pour valider la commande.
// app.use('/api/webhooks', stripeWebhookRouter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ---- Template engine EJS ----
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// ---- Fichiers statiques admin (CSS, JS) ----
app.use(
  '/admin/static',
  express.static(path.join(__dirname, '../public/admin'))
);

// ---- Fichiers statiques uploads ----
app.use(
  '/uploads',
  express.static(path.join(__dirname, '../public/uploads'), {
    setHeaders: (res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    },
  })
);

// ---- Routes API ----
app.get('/', (_req, res) => {
  res.json({ message: 'GreenRoots API is running' });
});

app.use('/api', router);
app.use('/api/search', searchRouter);

// ---- Routes Admin ----
app.use('/admin', adminRouter);

app.use(errorHandler);

export default app;

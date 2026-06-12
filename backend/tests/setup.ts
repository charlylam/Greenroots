// Ce fichier prépare l’environnement global des tests automatisés.
// Il permettra notamment de :
// - réinitialiser la base de données de test ;
// - nettoyer les données entre les scénarios ;
// - fermer proprement la connexion Prisma après l’exécution des tests.

import { after } from 'node:test';

import { prisma } from '../src/lib/prisma.js';

// Ferme proprement la connexion Prisma une fois tous les tests terminés.
after(async () => {
  await prisma.$disconnect();
});

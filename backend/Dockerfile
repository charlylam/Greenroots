# Image de production du backend GreenRoots
FROM node:24-alpine

WORKDIR /app

# Installation des dépendances (les scripts postinstall de Prisma téléchargent
# les moteurs binaires et génèrent le client).
COPY package*.json ./
COPY prisma ./prisma
RUN npm install

# Code source et fichiers statiques (vues EJS, assets admin, uploads seed)
COPY . .
RUN cp -r public/uploads/seed /app/seed-backup

# Génère le client Prisma avec le schéma définitif
# DATABASE_URL factice : uniquement pour satisfaire la validation de
# prisma.config.ts au moment du build, aucune connexion réelle n'est faite.
ENV DATABASE_URL="postgresql://user:password@localhost:5432/db"
RUN npx prisma generate

# Compile le TypeScript vers dist/, copie la doc Swagger
RUN npm run build

EXPOSE 3001

# Au démarrage : applique les migrations en attente, puis lance le serveur compilé
CMD ["sh", "-c", "mkdir -p public/uploads/seed && cp -rn /app/seed-backup/* public/uploads/seed/ 2>/dev/null; DATABASE_URL=$DIRECT_URL npm run db:deploy && npm run start:prod"]

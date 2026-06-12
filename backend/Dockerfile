
# Image de developpement du backend GreenRoots
FROM node:24-alpine

WORKDIR /app

# Installation des dependances (les scripts postinstall de Prisma telechargent
# les moteurs binaires et generent le client — necessaire pour la CI).

COPY package*.json ./
COPY prisma ./prisma
RUN npm install
# Code source
COPY . .

EXPOSE 3001

# Au demarrage : on regenere le client (utile en dev car le code est monte via volume).
CMD ["sh", "-c", "npx prisma generate && npm run dev"]

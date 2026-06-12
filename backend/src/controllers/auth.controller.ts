import type { Request, Response } from 'express';
import argon2 from 'argon2';
import jwt, { type Secret, type SignOptions } from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';
import { ConflictError, UnauthorizedError } from '../lib/errors.js';
import {
  loginBodySchema,
  registerBodySchema,
} from '../validators/auth.validator.js';
import { sendRegistrationConfirmationEmail } from '../services/mail.service.js';

export async function registerUser(req: Request, res: Response) {
  const data = registerBodySchema.parse(req.body);

  // Vérifie si un utilisateur existe déjà avec cet email.
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  // Si un utilisateur existe déjà :
  if (existingUser) {
    throw new ConflictError('User already exists');
  }

  if (data.siret) {
    const existingSiret = await prisma.user.findUnique({
      where: { siret: data.siret },
    });

    if (existingSiret) {
      throw new ConflictError('SIRET already exists');
    }
  }

  // Hashage du mot de passe
  const hashedPassword = await argon2.hash(data.password);

  // Création de l'utilisateur dans la base de données
  const user = await prisma.user.create({
    data: {
      lastName: data.lastName,
      firstName: data.firstName,
      email: data.email,
      password: hashedPassword,
      address: data.address,
      postalCode: data.postalCode,
      city: data.city,
      type: data.type,

      // Ajoute les champs optionnels uniquement s'ils sont définis (&&).
      // Cela évite d'envoyer des valeurs undefined à Prisma.
      ...(data.siret && { siret: data.siret }),
      ...(data.companyName && { companyName: data.companyName }),
      ...(data.phone && { phone: data.phone }),
      acceptedTerms: true,
      acceptedTermsAt: new Date(),
    },

    // Permet de limiter les données renvoyées au frontend.
    select: {
      id: true,
      lastName: true,
      firstName: true,
      email: true,
      role: true,
      type: true,
      createdAt: true,
    },
  });

  try {
    await sendRegistrationConfirmationEmail(user.email, user.firstName);
  } catch (error) {
    console.error("Erreur lors de l'envoi du mail d'inscription :", error);
  }

  return res
    .status(201)
    .json({ message: 'Account created successfully', user });
}

export async function loginUser(req: Request, res: Response) {
  const { email, password } = loginBodySchema.parse(req.body);

  // Recherche de l'utilisateur par email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  if (user.deletedAt !== null) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const isPasswordValid = await argon2.verify(user.password, password);

  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid email or password');
  }

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  // Génération du token JWT

  // Récupère la clé secrète utilisée pour signer les JWT.
  // "as Secret" permet d'indiquer à TypeScript que la variable
  // correspond bien au type attendu par jsonwebtoken.
  const jwtSecret = process.env.JWT_SECRET as Secret;

  // Récupère la durée d'expiration du token depuis les variables
  // d'environnement. Si aucune valeur n'est définie,
  // le token expirera après 1 jour par défaut.
  //
  // Le typage "NonNullable<SignOptions['expiresIn']>"
  // permet d'utiliser un format compatible avec jsonwebtoken
  // comme "1d", "15m" ou un nombre en secondes.
  const jwtExpiresIn = (process.env.JWT_EXPIRES_IN || '1d') as NonNullable<
    SignOptions['expiresIn']
  >;

  // Génération du token JWT.
  // Le payload contient les informations utilisateur
  // qui seront accessibles après vérification du token
  // dans le middleware d'authentification.
  const token = jwt.sign({ userId: user.id, role: user.role }, jwtSecret, {
    expiresIn: jwtExpiresIn,
  });

  return res.status(200).json({
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      lastName: user.lastName,
      firstName: user.firstName,
      email: user.email,
      role: user.role,
      type: user.type,
    },
  });
}

export async function logoutUser(_req: Request, res: Response) {
  return res.status(200).json({ message: 'Logout successful' });
}

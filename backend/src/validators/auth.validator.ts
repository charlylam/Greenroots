import { z } from 'zod';

/**
 * Corps de POST /api/auth/register.
 * Les entreprises et associations doivent fournir SIRET + raison sociale.
 */
export const registerBodySchema = z
  .object({
    lastName: z.string().trim().min(1).max(80),
    firstName: z.string().trim().min(1).max(80),
    email: z.email().toLowerCase().trim(),
    // 8 caractères minimum. argon2 plafonne à 72 octets.
    password: z
      .string()
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
      .max(72)
      .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
      .regex(
        /[^A-Za-z0-9]/,
        'Le mot de passe doit contenir au moins un caractère spécial'
      ),
    address: z.string().trim().min(1).max(200),
    postalCode: z.string().trim().min(1).max(20),
    city: z.string().trim().min(1).max(100),
    type: z
      .enum(['particulier', 'entreprise', 'association'])
      .default('particulier'),
    siret: z
      .string()
      .trim()
      .regex(/^\d{14}$/, 'Le SIRET doit contenir 14 chiffres')
      .optional(),
    companyName: z.string().trim().min(1).max(150).optional(),
    phone: z.string().trim().min(1).max(30).optional(),
    acceptedTerms: z.literal(true, {
      message: "Vous devez accepter les conditions d'utilisation.",
    }),
  })
  .refine(
    (data) =>
      data.type === 'particulier' ||
      (data.siret !== undefined && data.companyName !== undefined),
    {
      message:
        'Les entreprises et associations doivent fournir un SIRET et une raison sociale',
      path: ['siret'],
    }
  );

/** Corps de POST /api/auth/login. */
export const loginBodySchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(1),
});

export type RegisterBody = z.infer<typeof registerBodySchema>;
export type LoginBody = z.infer<typeof loginBodySchema>;

import * as z from 'zod';

export const loginSchema = z.object({
    email: z.string().email({ message: 'Veuillez entrer une adresse e-mail valide.' }),
    password: z.string().min(6, { message: 'Le mot de passe doit contenir au moins 6 caractères.' }),
});

export const registerSchema = z.object({
    fullName: z.string().min(2, { message: 'Veuillez entrer votre nom complet.' }),
    email: z.string().email({ message: 'Veuillez entrer une adresse e-mail valide.' }),
    password: z.string().min(6, { message: 'Le mot de passe doit contenir au moins 6 caractères.' }),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas.',
    path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
    email: z.string().email({ message: 'Veuillez entrer une adresse e-mail valide.' }),
});

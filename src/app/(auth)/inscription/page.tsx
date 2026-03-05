'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';
import { registerSchema } from '@/lib/validations/auth';
import { useToast } from '@/hooks/use-toast';
import { GoogleAuthButton } from '@/components/auth/google-auth-button';

export default function RegisterPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const supabase = createClient();

    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            fullName: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    async function onSubmit(values: z.infer<typeof registerSchema>) {
        setIsLoading(true);

        try {
            const { error } = await supabase.auth.signUp({
                email: values.email,
                password: values.password,
                options: {
                    data: {
                        full_name: values.fullName,
                    },
                    emailRedirectTo: `${window.location.origin}/callback`,
                },
            });

            if (error) {
                throw error;
            }

            toast({
                title: 'Inscription réussie',
                description: 'Veuillez vérifier votre boîte de réception pour confirmer votre compte.',
            });

            // Consider pushing to /nos-tarifs, but without active session confirmation might be tricky.
            // Usually users confirm email first. For now, we redirect to login with a message.
            router.push('/connexion?message=check-email');
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Erreur',
                description: error.message || "Une erreur est survenue lors de l'inscription.",
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <div className="text-center mb-8">
                <h1 className="text-3xl font-heading font-extrabold text-rapido-blue mb-2">
                    Créer un compte
                </h1>
                <p className="text-sm text-rapido-blue/70">
                    Rejoignez Rapido'Devis et démarrez vos estimations gratuites.
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nom complet</FormLabel>
                                <FormControl>
                                    <Input placeholder="Jean Dupont" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Adresse e-mail</FormLabel>
                                <FormControl>
                                    <Input placeholder="vous@exemple.com" type="email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mot de passe</FormLabel>
                                <FormControl>
                                    <Input placeholder="••••••••" type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirmer le mot de passe</FormLabel>
                                <FormControl>
                                    <Input placeholder="••••••••" type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full bg-rapido-green hover:bg-rapido-green-600 text-white" disabled={isLoading}>
                        {isLoading ? 'Création en cours...' : "S'inscrire"}
                    </Button>
                </form>
            </Form>

            <div className="mt-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-muted-foreground">Ou</span>
                    </div>
                </div>

                <div className="mt-6">
                    <GoogleAuthButton text="S'inscrire avec Google" />
                </div>
            </div>

            <p className="mt-8 text-center text-sm text-rapido-blue/70">
                Vous avez déjà un compte ?{' '}
                <Link href="/connexion" className="font-semibold text-rapido-green hover:underline">
                    Se connecter
                </Link>
            </p>
        </>
    );
}

'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { loginSchema } from '@/lib/validations/auth';
import { useToast } from '@/hooks/use-toast';
import { GoogleAuthButton } from '@/components/auth/google-auth-button';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const message = searchParams.get('message');
    const errorParam = searchParams.get('error');

    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const supabase = createClient();

    // Show messages based on URL params (e.g. from redirect)
    // In a real app we might use a useEffect to show a toast once.

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    async function onSubmit(values: z.infer<typeof loginSchema>) {
        setIsLoading(true);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: values.email,
                password: values.password,
            });

            if (error) {
                throw error;
            }

            toast({
                title: 'Connexion réussie',
                description: 'Bienvenue sur Rapido\'Devis.',
            });

            router.push('/dashboard');
            router.refresh();
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Erreur de connexion',
                description: 'E-mail ou mot de passe incorrect.',
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <div className="text-center mb-8">
                <h1 className="text-3xl font-heading font-extrabold text-rapido-blue mb-2">
                    Bon retour
                </h1>
                <p className="text-sm text-rapido-blue/70">
                    Connectez-vous pour accéder à vos estimations.
                </p>
            </div>

            {message === 'check-email' && (
                <div className="mb-4 p-3 rounded-md bg-green-50 text-green-700 text-sm border border-green-200">
                    Vérifiez votre boîte de réception pour confirmer votre e-mail avant de vous connecter.
                </div>
            )}

            {errorParam === 'auth-code-error' && (
                <div className="mb-4 p-3 rounded-md bg-red-50 text-red-700 text-sm border border-red-200">
                    Une erreur est survenue lors de l'authentification avec Google. Veuillez réessayer.
                </div>
            )}

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                                <div className="flex items-center justify-between">
                                    <FormLabel>Mot de passe</FormLabel>
                                    <Link
                                        href="/mot-de-passe-oublie"
                                        className="text-xs font-medium text-rapido-green hover:underline"
                                        tabIndex={-1}
                                    >
                                        Mot de passe oublié ?
                                    </Link>
                                </div>
                                <FormControl>
                                    <Input placeholder="••••••••" type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full bg-rapido-green hover:bg-rapido-green-600 text-white" disabled={isLoading}>
                        {isLoading ? 'Connexion en cours...' : "Se connecter"}
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
                    <GoogleAuthButton text="Se connecter avec Google" />
                </div>
            </div>

            <p className="mt-8 text-center text-sm text-rapido-blue/70">
                Pas encore de compte ?{' '}
                <Link href="/inscription" className="font-semibold text-rapido-green hover:underline">
                    Créer un compte
                </Link>
            </p>
        </>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="flex h-40 items-center justify-center">Chargement...</div>}>
            <LoginForm />
        </Suspense>
    );
}

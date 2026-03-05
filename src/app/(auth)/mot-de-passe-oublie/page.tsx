'use client';

import { useState } from 'react';
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
import { forgotPasswordSchema } from '@/lib/validations/auth';
import { useToast } from '@/hooks/use-toast';

export default function ForgotPasswordPage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const supabase = createClient();

    const form = useForm<z.infer<typeof forgotPasswordSchema>>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: '',
        },
    });

    async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
        setIsLoading(true);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
                redirectTo: `${window.location.origin}/reinitialiser-mot-de-passe`,
            });

            if (error) {
                throw error;
            }

            setIsSubmitted(true);
            toast({
                title: 'E-mail envoyé',
                description: 'Vérifiez votre boîte de réception pour réinitialiser votre mot de passe.',
            });
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Erreur',
                description: error.message || 'Impossible d\'envoyer l\'e-mail de réinitialisation.',
            });
        } finally {
            setIsLoading(false);
        }
    }

    if (isSubmitted) {
        return (
            <div className="text-center">
                <h1 className="text-2xl font-heading font-extrabold text-rapido-blue mb-4">
                    Vérifiez votre boîte mail
                </h1>
                <p className="text-sm text-rapido-blue/70 mb-8">
                    Si un compte existe pour cette adresse, un lien a été envoyé pour réinitialiser le mot de passe.
                </p>
                <Link href="/connexion">
                    <Button variant="outline" className="w-full">
                        Retour à la connexion
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <>
            <div className="text-center mb-8">
                <h1 className="text-3xl font-heading font-extrabold text-rapido-blue mb-2">
                    Mot de passe oublié
                </h1>
                <p className="text-sm text-rapido-blue/70">
                    Saisissez votre e-mail pour recevoir un lien de réinitialisation.
                </p>
            </div>

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

                    <Button type="submit" className="w-full bg-rapido-green hover:bg-rapido-green-600 text-white" disabled={isLoading}>
                        {isLoading ? 'Envoi en cours...' : "Envoyer le lien"}
                    </Button>
                </form>
            </Form>

            <div className="mt-8 text-center text-sm">
                <Link href="/connexion" className="font-medium text-rapido-blue/70 hover:text-rapido-blue transition-colors">
                    &larr; Retour à la connexion
                </Link>
            </div>
        </>
    );
}

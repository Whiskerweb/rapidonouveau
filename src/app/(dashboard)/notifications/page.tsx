import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { NotificationsList } from '@/components/dashboard/notifications-list';

export default async function NotificationsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect('/connexion');

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-heading font-extrabold text-rapido-blue">
                    Notifications
                </h1>
                <p className="text-zinc-500 text-sm mt-1">
                    Suivez l&apos;avancement de vos demandes.
                </p>
            </div>

            <NotificationsList userId={user.id} />
        </div>
    );
}

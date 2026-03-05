import Link from 'next/link';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-rapido-light flex flex-col items-center justify-center p-4 sm:p-8">
            <Link href="/" className="mb-8">
                {/* Placeholder for real logo */}
                <span className="font-heading font-extrabold text-2xl text-rapido-blue">
                    Rapido'Devis
                </span>
            </Link>

            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden glass border-border p-8">
                {children}
            </div>

            <div className="mt-8 text-sm text-center text-rapido-blue/70">
                &copy; {new Date().getFullYear()} Rapido'Devis. Tous droits réservés.
            </div>
        </div>
    );
}

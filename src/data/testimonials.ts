export interface Testimonial {
    name: string;
    role: string;
    company: string;
    content: string;
    image?: string;
    rating: number;
    metier?: string;
}

export const TESTIMONIALS: Testimonial[] = [
    {
        name: "Marc Leroux",
        role: "Gérant",
        company: "Leroux Maçonnerie",
        content: "Rapido'Devis a changé ma vie de patron. Je ne passe plus mes dimanches à faire des métrés. L'IA est bluffante de précision sur les plans PDF.",
        rating: 5,
        metier: "maçonnerie"
    },
    {
        name: "Sophie Valet",
        role: "Marchand de Biens",
        company: "ImmoInvest",
        content: "Indispensable pour mes acquisitions. Je reçois une estimation certifiée en 24h, ce qui me permet de faire mes offres d'achat avant tout le monde.",
        rating: 5,
    },
    {
        name: "Jean-Philippe Morin",
        role: "Artisan Peintre",
        company: "Morin Finitions",
        content: "Le standard 'Bank-Ready' est un vrai plus. Mes clients n'ont plus de problèmes pour faire valider leurs prêts travaux auprès de leurs banques.",
        rating: 5,
        metier: "peinture"
    },
    {
        name: "Lucas Deprez",
        role: "Électricien",
        company: "Deprez Élec",
        content: "L'application mobile est top sur le chantier. Je prends mes photos, je dicte mes notes, et le devis se prépare tout seul. Un gain de temps fou.",
        rating: 5,
        metier: "electricite"
    },
    {
        name: "Carine Dumas",
        role: "Architecte d'intérieur",
        company: "Studio Dumas",
        content: "Une fiabilité technique rare pour un outil automatisé. Le fait qu'un expert valide chaque dossier derrière l'IA me rassure énormément.",
        rating: 5,
    },
    {
        name: "Thomas Bernard",
        role: "Plombier",
        company: "TB Services",
        content: "Enfin un outil qui comprend les contraintes du bâtiment. Les métrés sont justes et la nomenclature est celle que j'utilise au quotidien.",
        rating: 4,
        metier: "plomberie"
    }
];

export interface Article {
    title: string;
    slug: string;
    date: string;
    excerpt: string;
    category: string;
    image?: string;
    content: string;
    author: string;
}

export const ARTICLES: Article[] = [
    {
        title: "L'IA au service du bâtiment : Révolution ou gadget ?",
        slug: "ia-batiment-revolution-ou-gadget",
        date: "2026-03-05",
        excerpt: "Analyse de l'impact de l'intelligence artificielle sur le quotidien des artisans et des économistes de la construction.",
        category: "Technologie",
        image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=800",
        author: "L'équipe Rapido",
        content: `
            <p>L'intelligence artificielle n'est plus un concept de science-fiction pour les professionnels du BTP. Aujourd'hui, elle s'invite concrètement dans le processus de chiffrage.</p>
            <h3>Un gain de temps sans précédent</h3>
            <p>Le principal avantage de l'IA réside dans sa capacité à traiter des volumes de données en un temps record. Là où un humain passe plusieurs heures à faire les métrés d'un plan complexe, l'IA de Rapido'Devis le fait en quelques secondes.</p>
            <h3>La précision avant tout</h3>
            <p>L'IA ne fatigue pas. Elle ne rate aucune ligne sur un PDF et applique les mêmes règles de calcul avec une constance absolue. Couplée à une validation humaine, elle devient l'atout numéro un pour sécuriser ses marges.</p>
        `
    },
    {
        title: "Comment optimiser ses marges en période d'inflation des matériaux",
        slug: "optimiser-marges-inflation-materiaux",
        date: "2026-02-28",
        excerpt: "Nos conseils pour réajuster vos devis en temps réel face à la volatilité des prix du cuivre, du bois et du béton.",
        category: "Gestion",
        image: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=800",
        author: "Expert BTP",
        content: `
            <p>Le marché des matériaux de construction connaît une volatilité historique. Pour un artisan, ne pas mettre à jour ses tarifs peut signifier la perte de sa marge bénéficiaire sur un chantier.</p>
            <h3>L'importance des devis estimatifs</h3>
            <p>Utiliser des outils comme Rapido'Devis permet de se baser sur des bases de prix actualisées localement, évitant ainsi de chiffrer avec des tarifs obsolètes.</p>
            <h3>La réactivité est la clé</h3>
            <p>En réduisant le temps de chiffrage de 48h à quelques heures, vous pouvez soumettre vos propositions plus vite et verrouiller vos commandes de matériaux auprès de vos fournisseurs dans les meilleurs délais.</p>
        `
    },
    {
        title: "Sécuriser ses dossiers de prêt : Ce que les banques attendent de vos devis",
        slug: "securiser-dossiers-pret-banques",
        date: "2026-02-15",
        excerpt: "Pourquoi un devis 'Bank-Ready' est indispensable pour rassurer les établissements de crédit et déclencher les chantiers.",
        category: "Conseils",
        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800",
        author: "Conseiller Financier",
        content: `
            <p>Pour le client, l'obtention du prêt est le verrou critique du chantier. Pour la banque, la clarté et la conformité du devis sont les éléments de rassurance principaux.</p>
            <h3>La structure d'un devis professionnel</h3>
            <p>Une banque a besoin de voir des postes détaillés, une nomenclature claire et des métrés justifiés. Un document 'fait main' sur un coin de table est souvent synonyme de rejet.</p>
            <h3>L'atout certification</h3>
            <p>Les estimations validées par des économistes de la construction apportent une crédibilité supplémentaire. C'est ce que nous appelons le standard 'Bank-Ready' chez Rapido'Devis.</p>
        `
    }
];

import { HardHat, Paintbrush, Zap, Droplets, Hammer, Sparkles, ShieldCheck, Landmark, Clock, FileText } from 'lucide-react';

export const METIERS_DATA = {
    maconnerie: {
        title: "Estimation Travaux Maçonnerie",
        slug: "maconnerie",
        heroTitle: "L'IA qui chiffre vos chantiers de ",
        heroTitleAccent: "maçonnerie.",
        description: "Optimisez vos marges sur le gros œuvre. De la dalle à l'élévation, obtenez un chiffrage précis validé par des experts du bâtiment.",
        icon: HardHat,
        benefits: [
            "Calcul précis des volumes de béton et armatures",
            "Prise en compte des tarifs matériaux régionaux",
            "Rapport conforme pour garanties décennales",
            "Gain de 4h par dossier d'estimation"
        ],
        arguments: [
            {
                title: "Scan IA Spécialisé",
                desc: "Notre IA identifie les structures sur vos plans PDF et calcule automatiquement les surfaces de coffrage et d'élévation.",
                icon: Sparkles
            },
            {
                title: "Validation MOE",
                desc: "Chaque estimation de maçonnerie est revue par un Maître d'Œuvre pour valider la faisabilité technique et les ratios.",
                icon: ShieldCheck
            },
            {
                title: "Bank Ready",
                desc: "Des rapports ultra-détaillés qui rassurent les banquiers pour le déblocage des prêts de vos clients.",
                icon: Landmark
            }
        ],
        stats: [
            { label: "Précision", value: "98%" },
            { label: "Temps gagné", value: "85%" },
            { label: "Délai", value: "48h" }
        ],
        faqs: [
            { q: "L'IA prend-elle en compte le ferraillage ?", a: "Oui, notre Scan IA estime les ratios d'acier selon le type de structure (dalle, poutre, mur banché)." },
            { q: "Le chiffrage inclut-il le terrassement ?", a: "Le chiffrage se concentre sur la maçonnerie, mais nous incluons les fouilles et évacuations liées aux fondations." },
            { q: "Comment sont calculés les prix du béton ?", a: "Nous utilisons des indices régionaux actualisés mensuellement pour refléter le coût réel des centrales." }
        ]
    },
    peinture: {
        title: "Estimation Travaux Peinture",
        slug: "peinture",
        heroTitle: "Ne perdez plus de temps sur vos ",
        heroTitleAccent: "métrés de peinture.",
        description: "Simplifiez le chiffrage de vos finitions intérieures. Analyse automatique des surfaces (murs, plafonds) et intégration des prix de vos fournisseurs.",
        icon: Paintbrush,
        benefits: [
            "Extraction automatique des surfaces par pièce",
            "Gestion des sous-couches et finitions",
            "Baisse du risque d'erreur de chiffrage",
            "Image de marque professionnelle"
        ],
        arguments: [
            {
                title: "Métrés Instantanés",
                desc: "Uploadez vos plans et laissez l'IA déduire les surfaces nettes de peinture après déduction des ouvertures.",
                icon: Clock
            },
            {
                title: "Expertise Finition",
                desc: "Nos experts vérifient la cohérence des cycles de peinture choisis selon les supports identifiés.",
                icon: ShieldCheck
            },
            {
                title: "Rapport Client",
                desc: "Un PDF clair et esthétique qui justifie chaque centime de votre prestation.",
                icon: FileText
            }
        ],
        stats: [
            { label: "Surfaces", value: "Exactes" },
            { label: "Rentabilité", value: "+12%" },
            { label: "Devis pro", value: "100%" }
        ],
        faqs: [
            { q: "Déduisez-vous les 'vides pour pleins' ?", a: "Oui, notre algorithme retire automatiquement les surfaces de fenêtres et portes au-delà de 2m²." },
            { q: "Gérez-vous les différents types de finition ?", a: "Absolument. Vous pouvez spécifier finitions Mate, Satinée ou Velours pour chaque zone." },
            { q: "Le ratissage est-il inclus ?", a: "Le temps de préparation des supports (ponçage, impression, ratissage) est chiffré selon l'état sélectionné." }
        ]
    },
    electricite: {
        title: "Estimation Travaux Électricité",
        slug: "electricite",
        heroTitle: "Chiffrez vos installations ",
        heroTitleAccent: "électriques par IA.",
        description: "De la mise aux normes NF C 15-100 à la domotique, sécurisez vos chiffrages avec une analyse experte de vos besoins en appareillage.",
        icon: Zap,
        benefits: [
            "Nomenclature complète de l'appareillage",
            "Conformité NF C 15-100 intégrée",
            "Optimisation du temps de chiffrage",
            "Validation par bureau d'études"
        ],
        arguments: [
            {
                title: "Scan de Plans",
                desc: "L'IA détecte les symboles électriques et génère une liste exhaustive de matériel.",
                icon: Sparkles
            },
            {
                title: "Conformité Normative",
                desc: "Estimation revue sous l'angle de la sécurité électrique par nos experts.",
                icon: ShieldCheck
            },
            {
                title: "Estimation Flash",
                desc: "Un pré-chiffrage en quelques minutes pour répondre plus vite à vos appels d'offres.",
                icon: Clock
            }
        ],
        stats: [
            { label: "Normes", value: "100%" },
            { label: "Matériel", value: "Détaillé" },
            { label: "Rapidité", value: "x5" }
        ],
        faqs: [
            { q: "Le tableau électrique est-il dimensionné ?", a: "Oui, nous estimons la taille du tableau et le nombre de modules selon la configuration du logement." },
            { q: "Gérez-vous la RT2012 / RE2020 ?", a: "Nos experts intègrent les contraintes d'étanchéité à l'air (boîtiers BBC) dans l'estimation." },
            { q: "Peut-on chiffrer de la domotique ?", a: "Oui, des packs domotiques (KNX, Zigbee) peuvent être ajoutés au chiffrage standard." }
        ]
    },
    plomberie: {
        title: "Estimation Travaux Plomberie",
        slug: "plomberie",
        heroTitle: "La plomberie chiffrée avec une ",
        heroTitleAccent: "précision chirurgicale.",
        description: "Réseaux, sanitaires, chauffage. Obtenez une estimation modulaire et précise pour tous vos projets de rénovation ou de neuf.",
        icon: Droplets,
        benefits: [
            "Listing complet des points d'eau",
            "Gestion des réseaux cuivre/PER/multicouche",
            "Prix actualisés des grandes marques",
            "Expertise technique certifiée"
        ],
        arguments: [
            {
                title: "Analyse Technique",
                desc: "Vérification des diamètres et des évacuations par nos experts en génie climatique.",
                icon: ShieldCheck
            },
            {
                title: "Audit Devis",
                desc: "Utilisez Rapido'Devis pour vérifier si vos propres calculs sont cohérents avec le marché.",
                icon: FileText
            },
            {
                title: "Bank Ready",
                desc: "Présentez des estimations solides pour les dossiers d'éco-PTZ ou MaPrimeRénov'.",
                icon: Landmark
            }
        ],
        stats: [
            { label: "Audit", value: "Certifié" },
            { label: "Gain temps", value: "70%" },
            { label: "Dossiers", value: "Solides" }
        ],
        faqs: [
            { q: "Gérez-vous la climatisation ?", a: "Oui, les systèmes split et gainables font partie de nos modules d'estimation thermique." },
            { q: "Les raccordements extérieurs sont-ils calculés ?", a: "Nous chiffrons les attentes jusqu'au tabouret de branchement en limite de propriété." },
            { q: "Incluez-vous les équipements sanitaires ?", a: "Vous pouvez choisir entre une estimation 'pose seule' ou 'fourniture et pose' avec plusieurs gammes." }
        ]
    },
    menuiserie: {
        title: "Estimation Travaux Menuiserie",
        slug: "menuiserie",
        heroTitle: "Chiffrez vos ouvertures et ",
        heroTitleAccent: "agencements sur-mesure.",
        description: "Fenêtres, portes, cuisines. L'IA Rapido'Devis analyse vos plans pour une estimation fluide de toutes vos menuiseries intérieures et extérieures.",
        icon: Hammer,
        benefits: [
            "Détection automatique des baies et ouvertures",
            "Large choix de matériaux (PVC, Alu, Bois)",
            "Précision sur les performances thermiques",
            "Rapports visuels et descriptifs"
        ],
        arguments: [
            {
                title: "Scan Intelligent",
                desc: "L'outil repère les dimensions standard et sur-mesure sur vos documents techniques.",
                icon: Sparkles
            },
            {
                title: "Validation Artisan",
                desc: "Validation par un ancien artisan menuisier pour garantir la réalité du terrain.",
                icon: ShieldCheck
            },
            {
                title: "Vente Facilitée",
                desc: "Des documents pro qui font la différence face à la concurrence.",
                icon: FileText
            }
        ],
        stats: [
            { label: "Conversion", value: "+25%" },
            { label: "Précision", value: "Totale" },
            { label: "Délai", value: "48h" }
        ],
        faqs: [
            { q: "Détectez-vous le sens d'ouverture ?", a: "Dans 90% des cas, l'IA identifie le sens d'ouverture sur le plan pour optimiser l'implantation." },
            { q: "Quid des menuiseries spécifiques ?", a: "Châssis fixes, oeil de boeuf ou baies d'angle sont identifiés et validés manuellement par nos experts." },
            { q: "Gérez-vous la domotique des volets ?", a: "Oui, les options de motorisation et de centralisation sont intégrées au chiffrage." }
        ]
    }
};

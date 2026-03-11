// Configuration du questionnaire intelligent
// Conforme à la section 3.3 de ARCHITECTURE_RAPIDO_DEVIS.md

export type QuestionType = 'single_choice' | 'multi_choice' | 'numeric' | 'free_text' | 'date' | 'address'

export interface QuestionOption {
  value: string
  label: string
}

export interface Question {
  id: string
  text: string
  type: QuestionType
  options?: QuestionOption[]
  placeholder?: string
  hint?: string
  required?: boolean
  unit?: string
  // Branchement conditionnel : valeur → id de la section suivante
  triggersNext?: Record<string, string>
  // Voice & AI
  voice_enabled?: boolean
  ai_follow_up?: boolean
}

export interface QuestionSection {
  id: string
  title: string
  description?: string
  questions: Question[]
  // Section suivante par défaut (si pas de triggersNext)
  nextSection?: string
}

export interface QuestionnaireConfig {
  sections: QuestionSection[]
}

// ─── Configuration complète ──────────────────────────────────

export const questionnaireConfig: QuestionnaireConfig = {
  sections: [
    // ──── Section 1 : Type de projet ────
    {
      id: 'projet',
      title: 'Type de projet',
      description: 'Commençons par identifier votre projet.',
      questions: [
        {
          id: 'type_travaux',
          text: 'Quel type de travaux souhaitez-vous réaliser ?',
          type: 'single_choice',
          required: true,
          options: [
            { value: 'renovation_complete', label: 'Rénovation complète' },
            { value: 'renovation_partielle', label: 'Rénovation partielle' },
            { value: 'construction_neuve', label: 'Construction neuve' },
            { value: 'extension', label: 'Extension / Surélévation' },
            { value: 'amenagement', label: 'Aménagement intérieur' },
          ],
          voice_enabled: true,
          triggersNext: {
            'renovation_complete': 'renovation',
            'renovation_partielle': 'renovation',
            'construction_neuve': 'construction',
            'extension': 'extension',
            'amenagement': 'amenagement',
          },
        },
      ],
    },

    // ──── Section 2 : Bien ────
    {
      id: 'bien',
      title: 'Le bien',
      description: 'Décrivez le bien concerné par les travaux.',
      questions: [
        {
          id: 'type_bien',
          text: 'Quel est le type de bien ?',
          type: 'single_choice',
          required: true,
          options: [
            { value: 'maison', label: 'Maison individuelle' },
            { value: 'appartement', label: 'Appartement' },
            { value: 'immeuble', label: 'Immeuble' },
            { value: 'local_commercial', label: 'Local commercial' },
            { value: 'autre', label: 'Autre' },
          ],
        },
        {
          id: 'surface',
          text: 'Quelle est la surface approximative ?',
          type: 'numeric',
          required: true,
          unit: 'm²',
          placeholder: '85',
          hint: 'Surface totale en mètres carrés',
          voice_enabled: true,
        },
        {
          id: 'annee_construction',
          text: 'Année de construction (approximative)',
          type: 'numeric',
          placeholder: '1975',
          hint: 'Laissez vide si vous ne savez pas',
        },
        {
          id: 'nombre_pieces',
          text: 'Nombre de pièces principales',
          type: 'numeric',
          placeholder: '5',
        },
        {
          id: 'nombre_niveaux',
          text: 'Nombre de niveaux',
          type: 'numeric',
          placeholder: '2',
        },
      ],
      nextSection: 'localisation',
    },

    // ──── Section 3 : Localisation ────
    {
      id: 'localisation',
      title: 'Localisation',
      questions: [
        {
          id: 'adresse',
          text: 'Adresse du bien',
          type: 'address',
          placeholder: '12 rue des Lilas',
        },
        {
          id: 'code_postal',
          text: 'Code postal',
          type: 'free_text',
          required: true,
          placeholder: '29200',
        },
        {
          id: 'ville',
          text: 'Ville',
          type: 'free_text',
          required: true,
          placeholder: 'Brest',
        },
      ],
      // nextSection déterminé dynamiquement par le type_travaux
    },

    // ──── Section Rénovation ────
    {
      id: 'renovation',
      title: 'Détails de la rénovation',
      description: 'Précisez les postes de travaux concernés.',
      questions: [
        {
          id: 'postes_travaux',
          text: 'Quels postes de travaux souhaitez-vous inclure ?',
          type: 'multi_choice',
          required: true,
          options: [
            { value: 'plomberie', label: 'Plomberie' },
            { value: 'electricite', label: 'Électricité' },
            { value: 'peinture', label: 'Peinture' },
            { value: 'sols', label: 'Revêtements de sol' },
            { value: 'carrelage', label: 'Carrelage' },
            { value: 'menuiserie', label: 'Menuiserie (portes, fenêtres)' },
            { value: 'isolation', label: 'Isolation' },
            { value: 'toiture', label: 'Toiture' },
            { value: 'chauffage', label: 'Chauffage / Climatisation' },
            { value: 'cuisine', label: 'Cuisine' },
            { value: 'sdb', label: 'Salle de bain' },
            { value: 'demolition', label: 'Démolition / Gros oeuvre' },
          ],
        },
        {
          id: 'etat_actuel',
          text: 'Quel est l\'état actuel du bien ?',
          type: 'single_choice',
          options: [
            { value: 'bon', label: 'Bon état (rafraîchissement)' },
            { value: 'moyen', label: 'État moyen (travaux modérés)' },
            { value: 'mauvais', label: 'Mauvais état (rénovation lourde)' },
            { value: 'inhabitable', label: 'Inhabitable (réhabilitation complète)' },
          ],
        },
        {
          id: 'gamme_souhaitee',
          text: 'Quelle gamme de finitions souhaitez-vous ?',
          type: 'single_choice',
          options: [
            { value: 'economique', label: 'Économique' },
            { value: 'standard', label: 'Standard' },
            { value: 'haut_de_gamme', label: 'Haut de gamme' },
          ],
        },
      ],
      nextSection: 'contraintes',
    },

    // ──── Section Construction ────
    {
      id: 'construction',
      title: 'Détails de la construction',
      questions: [
        {
          id: 'type_construction',
          text: 'Quel type de construction ?',
          type: 'single_choice',
          required: true,
          options: [
            { value: 'traditionnelle', label: 'Construction traditionnelle' },
            { value: 'ossature_bois', label: 'Ossature bois' },
            { value: 'prefabriquee', label: 'Construction préfabriquée' },
            { value: 'container', label: 'Container aménagé' },
          ],
        },
        {
          id: 'terrain_viabilise',
          text: 'Le terrain est-il viabilisé ?',
          type: 'single_choice',
          options: [
            { value: 'oui', label: 'Oui' },
            { value: 'non', label: 'Non' },
            { value: 'partiellement', label: 'Partiellement' },
            { value: 'ne_sais_pas', label: 'Je ne sais pas' },
          ],
        },
        {
          id: 'permis_construire',
          text: 'Avez-vous obtenu le permis de construire ?',
          type: 'single_choice',
          options: [
            { value: 'oui', label: 'Oui, obtenu' },
            { value: 'en_cours', label: 'En cours de demande' },
            { value: 'non', label: 'Pas encore déposé' },
          ],
        },
      ],
      nextSection: 'contraintes',
    },

    // ──── Section Extension ────
    {
      id: 'extension',
      title: 'Détails de l\'extension',
      questions: [
        {
          id: 'type_extension',
          text: 'Quel type d\'extension ?',
          type: 'single_choice',
          required: true,
          options: [
            { value: 'extension_laterale', label: 'Extension latérale' },
            { value: 'surelevation', label: 'Surélévation' },
            { value: 'veranda', label: 'Véranda' },
            { value: 'garage', label: 'Garage / Dépendance' },
          ],
        },
        {
          id: 'surface_extension',
          text: 'Surface de l\'extension souhaitée',
          type: 'numeric',
          unit: 'm²',
          placeholder: '30',
        },
      ],
      nextSection: 'contraintes',
    },

    // ──── Section Aménagement ────
    {
      id: 'amenagement',
      title: 'Détails de l\'aménagement',
      questions: [
        {
          id: 'pieces_concernees',
          text: 'Quelles pièces sont concernées ?',
          type: 'multi_choice',
          required: true,
          options: [
            { value: 'cuisine', label: 'Cuisine' },
            { value: 'sdb', label: 'Salle de bain' },
            { value: 'salon', label: 'Salon / Séjour' },
            { value: 'chambre', label: 'Chambre(s)' },
            { value: 'combles', label: 'Combles' },
            { value: 'sous_sol', label: 'Sous-sol / Cave' },
            { value: 'bureau', label: 'Bureau' },
          ],
        },
        {
          id: 'type_amenagement',
          text: 'Type d\'aménagement principal',
          type: 'single_choice',
          options: [
            { value: 'redistribution', label: 'Redistribution des espaces' },
            { value: 'decoration', label: 'Décoration / Rafraîchissement' },
            { value: 'mise_aux_normes', label: 'Mise aux normes' },
            { value: 'accessibilite', label: 'Accessibilité PMR' },
          ],
        },
      ],
      nextSection: 'contraintes',
    },

    // ──── Section Contraintes ────
    {
      id: 'contraintes',
      title: 'Contraintes & Planning',
      questions: [
        {
          id: 'contraintes_specifiques',
          text: 'Y a-t-il des contraintes particulières ?',
          type: 'multi_choice',
          voice_enabled: true,
          ai_follow_up: true,
          options: [
            { value: 'acces_difficile', label: 'Accès difficile (étage, ruelle étroite...)' },
            { value: 'copropriete', label: 'Copropriété (autorisation nécessaire)' },
            { value: 'batiment_ancien', label: 'Bâtiment ancien / Classé' },
            { value: 'amiante', label: 'Présence possible d\'amiante' },
            { value: 'habite_pendant_travaux', label: 'Habité pendant les travaux' },
            { value: 'aucune', label: 'Aucune contrainte particulière' },
          ],
        },
        {
          id: 'urgence',
          text: 'Quel est votre délai souhaité ?',
          type: 'single_choice',
          options: [
            { value: 'flexible', label: 'Flexible (pas de date butoir)' },
            { value: '3_mois', label: 'Dans les 3 prochains mois' },
            { value: '1_mois', label: 'Dans le mois' },
            { value: 'urgent', label: 'Urgent (dès que possible)' },
          ],
        },
        {
          id: 'budget_indicatif',
          text: 'Avez-vous un budget indicatif ?',
          type: 'free_text',
          voice_enabled: true,
          ai_follow_up: true,
          placeholder: 'ex: 30 000 - 50 000 €',
          hint: 'Fourchette approximative, laissez vide si vous ne savez pas',
        },
      ],
      nextSection: 'description',
    },

    // ──── Section Description libre ────
    {
      id: 'description',
      title: 'Description du projet',
      description: 'Donnez-nous un maximum de détails pour affiner l\'estimation.',
      questions: [
        {
          id: 'description_libre',
          text: 'Décrivez votre projet avec vos propres mots',
          type: 'free_text',
          required: true,
          voice_enabled: true,
          ai_follow_up: true,
          placeholder: 'Décrivez les travaux souhaités, l\'état actuel du bien, vos attentes...',
          hint: 'Plus vous êtes précis, plus l\'estimation sera fiable.',
        },
      ],
      nextSection: 'documents',
    },

    // ──── Section Documents ────
    {
      id: 'documents',
      title: 'Documents & Photos',
      description: 'Ajoutez des documents pour affiner votre estimation (optionnel).',
      questions: [],
      // Pas de nextSection = dernière section
    },
  ],
}

// Ordre de parcours des sections
// Le flux est : projet → bien → localisation → (section dynamique selon type) → contraintes → description → documents
export function getSectionFlow(responses: Record<string, string | number | boolean | string[]>): string[] {
  const flow = ['projet', 'bien', 'localisation']

  // Ajouter la section dynamique basée sur type_travaux
  const typeQuestion = questionnaireConfig.sections[0].questions[0]
  const typeValue = responses['type_travaux'] as string

  if (typeQuestion.triggersNext && typeValue && typeQuestion.triggersNext[typeValue]) {
    flow.push(typeQuestion.triggersNext[typeValue])
  }

  flow.push('contraintes', 'description', 'documents')
  return flow
}

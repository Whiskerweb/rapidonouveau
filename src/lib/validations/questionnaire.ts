import * as z from 'zod'

// Réponse individuelle à une question
export const questionResponseSchema = z.object({
  questionId: z.string(),
  value: z.union([z.string(), z.number(), z.boolean(), z.array(z.string())]),
})

// Soumission complète du questionnaire
export const questionnaireSubmissionSchema = z.object({
  projectType: z.string().min(1, 'Le type de projet est requis.'),
  responses: z.array(questionResponseSchema).min(1, 'Au moins une réponse est requise.'),
  // Champs extraits des réponses pour la table estimations
  propertyType: z.string().optional(),
  surfaceM2: z.number().positive().optional(),
  address: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  department: z.string().optional(),
  notes: z.string().optional(),
})

export type QuestionnaireSubmission = z.infer<typeof questionnaireSubmissionSchema>
export type QuestionResponse = z.infer<typeof questionResponseSchema>

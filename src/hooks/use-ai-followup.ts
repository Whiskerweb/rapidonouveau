'use client'

import { useState, useCallback, useRef } from 'react'

interface FollowUp {
  questionId: string
  question: string
}

interface UseAiFollowupReturn {
  followUp: FollowUp | null
  isLoading: boolean
  checkForFollowUp: (questionId: string, answer: string, allResponses: Record<string, unknown>) => void
  submitFollowUp: (answer: string) => void
  skipFollowUp: () => void
}

const MAX_FOLLOWUPS = 3

export function useAiFollowup(): UseAiFollowupReturn {
  const [followUp, setFollowUp] = useState<FollowUp | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const followUpCountRef = useRef(0)

  const checkForFollowUp = useCallback(async (
    questionId: string,
    answer: string,
    allResponses: Record<string, unknown>
  ) => {
    // Rate limit: max 3 follow-ups per session
    if (followUpCountRef.current >= MAX_FOLLOWUPS) return

    setIsLoading(true)
    try {
      const res = await fetch('/api/ai/followup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId, answer, allResponses }),
      })

      if (!res.ok) {
        setIsLoading(false)
        return
      }

      const data = await res.json()

      if (data.followUpQuestion) {
        followUpCountRef.current++
        setFollowUp({
          questionId,
          question: data.followUpQuestion,
        })
      }
    } catch {
      // Silently fail — AI follow-up is optional
    } finally {
      setIsLoading(false)
    }
  }, [])

  const submitFollowUp = useCallback((_answer: string) => {
    setFollowUp(null)
  }, [])

  const skipFollowUp = useCallback(() => {
    setFollowUp(null)
  }, [])

  return {
    followUp,
    isLoading,
    checkForFollowUp,
    submitFollowUp,
    skipFollowUp,
  }
}

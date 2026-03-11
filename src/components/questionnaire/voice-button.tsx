'use client'

import { useEffect, useCallback } from 'react'
import { Mic, MicOff, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useVoiceInput } from '@/hooks/use-voice-input'
import type { QuestionOption } from '@/data/questionnaire-config'
import { matchVoiceToOption, extractNumberFromSpeech } from '@/lib/voice-utils'

interface VoiceButtonProps {
  questionType: 'single_choice' | 'multi_choice' | 'numeric' | 'free_text' | 'address' | 'date'
  options?: QuestionOption[]
  onResult: (value: string | number | string[]) => void
  currentValue?: string | number | boolean | string[]
  className?: string
}

export function VoiceButton({ questionType, options, onResult, currentValue, className }: VoiceButtonProps) {
  const {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    error,
    startListening,
    stopListening,
    resetTranscript,
  } = useVoiceInput()

  // Process transcript when we get a final result
  const processTranscript = useCallback((text: string) => {
    if (!text) return

    switch (questionType) {
      case 'single_choice': {
        if (options) {
          const match = matchVoiceToOption(text, options)
          if (match) onResult(match)
        }
        break
      }
      case 'multi_choice': {
        if (options) {
          const match = matchVoiceToOption(text, options)
          if (match) {
            const current = Array.isArray(currentValue) ? currentValue : []
            if (current.includes(match)) {
              onResult(current.filter(v => v !== match))
            } else {
              onResult([...current, match])
            }
          }
        }
        break
      }
      case 'numeric': {
        const num = extractNumberFromSpeech(text)
        if (num !== null) onResult(num)
        break
      }
      case 'free_text':
      case 'address': {
        onResult(text)
        break
      }
    }
  }, [questionType, options, onResult, currentValue])

  useEffect(() => {
    if (transcript) {
      processTranscript(transcript)
      resetTranscript()
    }
  }, [transcript, processTranscript, resetTranscript])

  const handleClick = () => {
    if (isListening) {
      stopListening()
    } else {
      resetTranscript()
      startListening()
    }
  }

  if (!isSupported) {
    return (
      <div className={`relative ${className || ''}`}>
        <button
          type="button"
          disabled
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-300 cursor-not-allowed"
          title="Reconnaissance vocale non disponible sur ce navigateur"
        >
          <MicOff className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <div className={`relative ${className || ''}`}>
      <motion.button
        type="button"
        onClick={handleClick}
        whileTap={{ scale: 0.95 }}
        className={`relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl transition-all ${
          isListening
            ? 'bg-rapido-green text-white shadow-lg shadow-rapido-green/30'
            : 'bg-rapido-blue/8 text-rapido-blue hover:bg-rapido-blue/15'
        }`}
        title={isListening ? 'Arrêter' : 'Parler'}
      >
        {isListening ? (
          <>
            {/* Pulse animation */}
            <motion.span
              className="absolute inset-0 rounded-xl bg-rapido-green"
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <Mic className="h-4 w-4 relative z-10" />
          </>
        ) : (
          <Mic className="h-4 w-4" />
        )}
      </motion.button>

      {/* Interim transcript badge */}
      <AnimatePresence>
        {(isListening && interimTranscript) && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-20 min-w-[200px] max-w-[300px]"
          >
            <div className="rounded-lg bg-rapido-blue px-3 py-2 text-xs text-white shadow-lg">
              <div className="flex items-center gap-2">
                <Loader2 className="h-3 w-3 animate-spin flex-shrink-0" />
                <span className="truncate italic">{interimTranscript}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-20 min-w-[180px]"
          >
            <div className="rounded-lg bg-red-500 px-3 py-1.5 text-[10px] text-white shadow-lg text-center whitespace-nowrap">
              {error}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

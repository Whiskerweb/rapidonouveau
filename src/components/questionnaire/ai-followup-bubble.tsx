'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, Send, SkipForward } from 'lucide-react'
import { VoiceButton } from './voice-button'

interface AiFollowupBubbleProps {
  followUp: { questionId: string; question: string } | null
  isLoading: boolean
  onSubmit: (answer: string) => void
  onSkip: () => void
  voiceEnabled?: boolean
}

export function AiFollowupBubble({ followUp, isLoading, onSubmit, onSkip, voiceEnabled }: AiFollowupBubbleProps) {
  const [answer, setAnswer] = useState('')

  const handleSubmit = () => {
    if (answer.trim()) {
      onSubmit(answer.trim())
      setAnswer('')
    }
  }

  const handleVoiceResult = (value: string | number | string[]) => {
    const text = String(value)
    setAnswer(text)
  }

  return (
    <AnimatePresence>
      {/* Loading state */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex items-center gap-3 px-4 py-3"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rapido-blue/10 text-rapido-blue flex-shrink-0">
            <Bot className="h-4 w-4" />
          </div>
          <div className="flex items-center gap-1.5">
            <motion.span
              className="h-2 w-2 rounded-full bg-rapido-blue/40"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
            />
            <motion.span
              className="h-2 w-2 rounded-full bg-rapido-blue/40"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
            />
            <motion.span
              className="h-2 w-2 rounded-full bg-rapido-blue/40"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
            />
          </div>
          <span className="text-xs text-zinc-400 italic">L&apos;IA analyse votre réponse...</span>
        </motion.div>
      )}

      {/* Follow-up question */}
      {followUp && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="space-y-3"
        >
          {/* AI bubble */}
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rapido-blue text-white flex-shrink-0 shadow-sm">
              <Bot className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="rounded-2xl rounded-tl-md bg-rapido-blue/5 border border-rapido-blue/10 px-4 py-3">
                <p className="text-sm text-rapido-blue leading-relaxed">
                  {followUp.question}
                </p>
              </div>
            </div>
          </div>

          {/* Answer input */}
          <div className="flex items-center gap-2 pl-12">
            <div className="flex-1 relative">
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && answer.trim()) handleSubmit()
                }}
                placeholder="Votre réponse..."
                className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-rapido-blue/20 focus:border-rapido-blue/30 transition-all"
              />
              {answer.trim() && (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="absolute right-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-lg bg-rapido-green text-white hover:bg-rapido-green/90 transition-colors"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {voiceEnabled && (
              <VoiceButton
                questionType="free_text"
                onResult={handleVoiceResult}
              />
            )}

            <button
              type="button"
              onClick={() => {
                setAnswer('')
                onSkip()
              }}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2.5 text-xs text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 transition-all flex-shrink-0"
            >
              <SkipForward className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Passer</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

'use client'

import type { Question } from '@/data/questionnaire-config'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { VoiceButton } from './voice-button'

interface QuestionRendererProps {
  question: Question
  value: string | number | boolean | string[] | undefined
  onChange: (questionId: string, value: string | number | boolean | string[]) => void
  voiceEnabled?: boolean
}

export function QuestionRenderer({ question, value, onChange, voiceEnabled }: QuestionRendererProps) {
  const showVoice = voiceEnabled && question.voice_enabled !== false

  const handleVoiceResult = (result: string | number | string[]) => {
    onChange(question.id, result)
  }

  const renderVoice = () => {
    if (!showVoice) return null
    return (
      <VoiceButton
        questionType={question.type}
        options={question.options}
        onResult={handleVoiceResult}
        currentValue={value}
        className="flex-shrink-0"
      />
    )
  }

  switch (question.type) {
    case 'single_choice':
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <label className="text-sm font-medium text-rapido-blue block">
              {question.text}
              {question.required && <span className="text-rapido-orange ml-1">*</span>}
            </label>
            {renderVoice()}
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {question.options?.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange(question.id, option.value)}
                className={`text-left rounded-xl border-2 px-4 py-3.5 text-sm transition-all ${
                  value === option.value
                    ? 'border-rapido-green bg-rapido-green/5 font-medium text-rapido-blue shadow-sm'
                    : 'border-zinc-200 text-zinc-600 hover:border-rapido-blue/30 hover:bg-zinc-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          {question.hint && <p className="text-xs text-zinc-400">{question.hint}</p>}
        </div>
      )

    case 'multi_choice':
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <label className="text-sm font-medium text-rapido-blue block">
              {question.text}
              {question.required && <span className="text-rapido-orange ml-1">*</span>}
            </label>
            {renderVoice()}
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {question.options?.map((option) => {
              const selected = Array.isArray(value) && value.includes(option.value)
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    const current = Array.isArray(value) ? value : []
                    const updated = selected
                      ? current.filter((v) => v !== option.value)
                      : [...current, option.value]
                    onChange(question.id, updated)
                  }}
                  className={`text-left rounded-xl border-2 px-4 py-3.5 text-sm transition-all flex items-center gap-2.5 ${
                    selected
                      ? 'border-rapido-green bg-rapido-green/5 font-medium text-rapido-blue shadow-sm'
                      : 'border-zinc-200 text-zinc-600 hover:border-rapido-blue/30 hover:bg-zinc-50'
                  }`}
                >
                  <Checkbox checked={selected} className="pointer-events-none" />
                  {option.label}
                </button>
              )
            })}
          </div>
          {question.hint && <p className="text-xs text-zinc-400">{question.hint}</p>}
        </div>
      )

    case 'numeric':
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <label className="text-sm font-medium text-rapido-blue block">
              {question.text}
              {question.required && <span className="text-rapido-orange ml-1">*</span>}
            </label>
            {renderVoice()}
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder={question.placeholder}
              value={value !== undefined ? String(value) : ''}
              onChange={(e) => {
                const num = e.target.value === '' ? '' : Number(e.target.value)
                onChange(question.id, num as number)
              }}
              className="max-w-xs"
            />
            {question.unit && <span className="text-sm text-zinc-500">{question.unit}</span>}
          </div>
          {question.hint && <p className="text-xs text-zinc-400">{question.hint}</p>}
        </div>
      )

    case 'free_text':
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <label className="text-sm font-medium text-rapido-blue block">
              {question.text}
              {question.required && <span className="text-rapido-orange ml-1">*</span>}
            </label>
            {renderVoice()}
          </div>
          {question.id === 'description_libre' ? (
            <textarea
              rows={5}
              placeholder={question.placeholder}
              value={(value as string) || ''}
              onChange={(e) => onChange(question.id, e.target.value)}
              className="flex w-full rounded-xl border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
            />
          ) : (
            <Input
              placeholder={question.placeholder}
              value={(value as string) || ''}
              onChange={(e) => onChange(question.id, e.target.value)}
            />
          )}
          {question.hint && <p className="text-xs text-zinc-400">{question.hint}</p>}
        </div>
      )

    case 'address':
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <label className="text-sm font-medium text-rapido-blue block">
              {question.text}
              {question.required && <span className="text-rapido-orange ml-1">*</span>}
            </label>
            {renderVoice()}
          </div>
          <Input
            placeholder={question.placeholder}
            value={(value as string) || ''}
            onChange={(e) => onChange(question.id, e.target.value)}
          />
          {question.hint && <p className="text-xs text-zinc-400">{question.hint}</p>}
        </div>
      )

    case 'date':
      return (
        <div className="space-y-3">
          <label className="text-sm font-medium text-rapido-blue block">
            {question.text}
            {question.required && <span className="text-rapido-orange ml-1">*</span>}
          </label>
          <Input
            type="date"
            value={(value as string) || ''}
            onChange={(e) => onChange(question.id, e.target.value)}
            className="max-w-xs"
          />
          {question.hint && <p className="text-xs text-zinc-400">{question.hint}</p>}
        </div>
      )

    default:
      return null
  }
}

'use client'

import { useState } from 'react'
import React from 'react'
import Link from 'next/link'
import { ArrowRight, RotateCcw, ShoppingBag, CheckCircle2, Sparkles, Snowflake, Flame } from 'lucide-react'
import { COLOR_RECOMMENDATIONS, cn } from '@/lib/utils'

type Vibe = 'WARM' | 'COOL' | 'NEUTRAL' | null

const steps = [
  {
    id: 1,
    title: 'The Jewelry Check',
    subtitle: 'Use natural daylight for best results',
    question: 'Which metal makes your skin look its clearest and gives a healthy glow?',
    options: [
      {
        label: 'Silver, Platinum, or White Gold',
        desc: 'These cool-toned metals seem to make my skin light up',
        vibe: 'COOL' as Vibe,
        emoji: <div className="w-8 h-8 rounded-full bg-gray-300 ring-2 ring-gray-400 flex-shrink-0" /> as React.ReactNode,
      },
      {
        label: 'Yellow Gold, Rose Gold, or Brass',
        desc: 'Warm metals just… work on me. I look more alive!',
        vibe: 'WARM' as Vibe,
        emoji: <div className="w-8 h-8 rounded-full bg-yellow-400 ring-2 ring-yellow-500 flex-shrink-0" /> as React.ReactNode,
      },
      {
        label: 'Both look equally great on me',
        desc: "I genuinely can't decide — both look fab",
        vibe: 'NEUTRAL' as Vibe,
        emoji: <Sparkles size={24} className="text-brand-purple" /> as React.ReactNode,
      },
    ],
  },
  {
    id: 2,
    title: 'The Contrast Check',
    subtitle: 'Best for deeper skin tones — skip if unsure!',
    question: 'Apply a cool-pink blush on one side of your face and a warm-orange blush on the other. Which one clashes (stands out awkwardly first)?',
    options: [
      {
        label: 'The warm-orange clashes',
        desc: 'The orange tones look out of place — my skin rejects warm',
        vibe: 'COOL' as Vibe,
        emoji: <Snowflake size={24} className="text-blue-400" /> as React.ReactNode,
      },
      {
        label: 'The cool-pink / blue clashes',
        desc: 'Pink or blue-toned anything looks weird — my skin rejects cool',
        vibe: 'WARM' as Vibe,
        emoji: <Flame size={24} className="text-orange-500" /> as React.ReactNode,
      },
      {
        label: "Skip this — I'm not sure",
        desc: "I'll go with my jewelry check result",
        vibe: null,
        emoji: <ArrowRight size={24} className="text-gray-400" /> as React.ReactNode,
      },
    ],
  },
]

export function ColorFinderWizard() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<(Vibe | null)[]>([null, null])
  const [result, setResult] = useState<'WARM' | 'COOL' | 'NEUTRAL' | null>(null)
  const [selected, setSelected] = useState<number | null>(null)

  const handleSelect = (optionIndex: number, vibe: Vibe) => {
    setSelected(optionIndex)
    const newAnswers = [...answers]
    newAnswers[step] = vibe
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (step === 0) {
      if (answers[0] === 'NEUTRAL') {
        // Skip to result
        setResult('NEUTRAL')
        setStep(2)
        return
      }
      setStep(1)
      setSelected(null)
    } else if (step === 1) {
      // Determine result
      const primary = answers[0]
      const secondary = answers[1]
      let finalVibe: 'WARM' | 'COOL' | 'NEUTRAL' = 'NEUTRAL'

      if (secondary === null || secondary === primary) {
        finalVibe = (primary as 'WARM' | 'COOL') || 'NEUTRAL'
      } else if (primary && secondary && primary !== secondary) {
        finalVibe = 'NEUTRAL'
      } else {
        finalVibe = (primary as 'WARM' | 'COOL') || 'NEUTRAL'
      }

      setResult(finalVibe)
      setStep(2)
    }
  }

  const reset = () => {
    setStep(0)
    setAnswers([null, null])
    setResult(null)
    setSelected(null)
  }

  // Results page
  if (step === 2 && result) {
    const rec = COLOR_RECOMMENDATIONS[result]

    return (
      <div className="animate-fade-in">
        {/* Result header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-600 border border-green-200 rounded-full px-4 py-2 text-sm font-bold mb-5">
            <CheckCircle2 size={16} /> Your Vibe is Identified!
          </div>
          <h2 className="font-script text-5xl mb-3">
            your vibe is{' '}
            <span
              className={cn(
                result === 'WARM' && 'text-amber-500',
                result === 'COOL' && 'text-brand-blue',
                result === 'NEUTRAL' && 'text-brand-purple'
              )}
            >
              {rec.vibe}
            </span>
            !
          </h2>
          <p className="text-gray-500 text-base max-w-md mx-auto">{rec.description}</p>
        </div>

        {/* Color cards */}
        <div className="space-y-4 mb-10">
          <h3 className="font-bold text-lg">
            Your Bold & Bright Power Palette
          </h3>
          {rec.colors.map((color, i) => (
            <div
              key={i}
              className="flex items-start gap-4 p-4 rounded-2xl border-2 border-gray-100 hover:border-gray-200 transition-colors"
            >
              <div
                className="w-14 h-14 rounded-2xl flex-shrink-0 shadow-md"
                style={{ background: color.hex }}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-bold text-sm">{color.name}</h4>
                  {color.tags.map((tag) => (
                    <span key={tag} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{color.why}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-brand-black rounded-3xl p-6 text-center">
          <h3 className="font-script text-3xl text-white mb-2">ready to glow?</h3>
          <p className="text-gray-400 text-sm mb-5">
            Shop pieces in your power palette and watch heads turn.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/shop" className="btn-primary">
              Shop All Colors <ArrowRight size={16} />
            </Link>
            <Link
              href={`/shop?color=${result.toLowerCase()}`}
              className="bg-white/10 text-white border border-white/20 font-semibold px-6 py-3 rounded-full hover:bg-white/20 transition inline-flex items-center gap-2 justify-center"
            >
              <ShoppingBag size={16} /> Browse My Palette
            </Link>
          </div>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={reset}
            className="text-sm text-gray-400 hover:text-brand-pink flex items-center gap-2 mx-auto transition-colors"
          >
            <RotateCcw size={14} /> Retake the Quiz
          </button>
        </div>
      </div>
    )
  }

  const currentStep = steps[step]

  return (
    <div>
      {/* Progress */}
      <div className="flex items-center gap-3 mb-8">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all',
                i < step
                  ? 'bg-brand-pink text-white'
                  : i === step
                  ? 'bg-brand-black text-white'
                  : 'bg-gray-100 text-gray-400'
              )}
            >
              {i < step ? <CheckCircle2 size={16} /> : s.id}
            </div>
            <span className={cn('text-xs font-semibold hidden sm:block', i === step ? 'text-brand-black' : 'text-gray-400')}>
              {s.title.split(' ').slice(0, 2).join(' ')}
            </span>
            {i < steps.length - 1 && <div className="w-8 h-0.5 bg-gray-200" />}
          </div>
        ))}
      </div>

      {/* Step card */}
      <div className="animate-fade-in">
        <div className="mb-2">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-pink">
            Step {step + 1} of {steps.length}
          </span>
        </div>
        <h2 className="font-bold text-2xl mb-1">{currentStep.title}</h2>
        <p className="text-xs text-gray-400 mb-2">{currentStep.subtitle}</p>
        <p className="text-gray-600 mb-6">{currentStep.question}</p>

        <div className="space-y-3">
          {currentStep.options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleSelect(i, option.vibe)}
              className={cn(
                'w-full text-left p-4 rounded-2xl border-2 transition-all hover:border-brand-pink group',
                selected === i
                  ? 'border-brand-pink bg-brand-pink/5'
                  : 'border-gray-200 bg-white hover:bg-gray-50'
              )}
            >
              <div className="flex items-center gap-3">
                {option.emoji}
                <div>
                  <p className="font-bold text-sm group-hover:text-brand-pink transition-colors">
                    {option.label}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{option.desc}</p>
                </div>
                {selected === i && (
                  <CheckCircle2 size={20} className="ml-auto text-brand-pink flex-shrink-0" />
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 flex justify-between items-center">
          {step > 0 && (
            <button
              onClick={() => { setStep(step - 1); setSelected(null) }}
              className="btn-outline py-2 px-5 text-sm"
            >
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={selected === null}
            className="btn-primary ml-auto disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {step === steps.length - 1 ? 'See My Results' : 'Next'} <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

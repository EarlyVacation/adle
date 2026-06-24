'use client'

import { GuessResult, CLOSE_YEARS } from '@/lib/gameLogic'

const MAX_GUESSES = 5

function EmptyDot() {
  return <div className="w-9 h-9 rounded-full border-2 border-gray-700" />
}

function CategoryBrandDot({ correct, delay }: { correct: boolean; delay: number }) {
  return (
    <div
      style={{ animationDelay: `${delay}ms` }}
      className={`w-9 h-9 rounded-full animate-dot-flip flex items-center justify-center ${
        correct ? 'bg-green-500' : 'bg-red-600'
      }`}
    >
      <span className="text-white text-xs font-bold leading-none select-none">
        {correct ? '✓' : '✗'}
      </span>
    </div>
  )
}

function YearDot({ guess, delay }: { guess: GuessResult; delay: number }) {
  const isCorrect = guess.yearFeedback === 'correct'
  const isClose = !isCorrect && guess.yearAbsDiff <= CLOSE_YEARS
  const colorClass = isCorrect ? 'bg-green-500' : isClose ? 'bg-orange-500' : 'bg-red-600'
  const symbol = isCorrect ? '✓' : guess.yearFeedback === 'too-early' ? '↑' : '↓'

  return (
    <div
      style={{ animationDelay: `${delay}ms` }}
      className={`w-9 h-9 rounded-full animate-dot-flip flex items-center justify-center ${colorClass}`}
    >
      <span className="text-white text-xs font-bold leading-none select-none">
        {symbol}
      </span>
    </div>
  )
}

interface Props {
  guesses: GuessResult[]
}

export default function GuessGrid({ guesses }: Props) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="grid grid-cols-3 gap-3">
        {(['Category', 'Brand', 'Year'] as const).map(label => (
          <p key={label} className="text-xs text-gray-500 text-center">{label}</p>
        ))}
      </div>
      {Array.from({ length: MAX_GUESSES }, (_, i) => {
        const g = guesses[i]
        return (
          <div key={i} className="grid grid-cols-3 gap-3 justify-items-center">
            {g ? (
              <>
                <CategoryBrandDot correct={g.categoryCorrect} delay={0} />
                <CategoryBrandDot correct={g.brandCorrect} delay={180} />
                <YearDot guess={g} delay={360} />
              </>
            ) : (
              <>
                <EmptyDot />
                <EmptyDot />
                <EmptyDot />
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}

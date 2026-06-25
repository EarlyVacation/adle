'use client'

import { GuessResult, CLOSE_YEARS } from '@/lib/gameLogic'

const MAX_GUESSES = 5

const colClass = 'grid-cols-[repeat(3,5rem)]'
const gapClass = 'gap-5'

function EmptyDot() {
  return <div className="w-16 h-16 rounded-full border-2 border-gray-700" />
}

function CategoryBrandDot({ correct, delay }: { correct: boolean; delay: number }) {
  return (
    <div
      style={{ animationDelay: `${delay}ms` }}
      className={`w-16 h-16 rounded-full animate-dot-flip flex items-center justify-center ${
        correct ? 'bg-green-500' : 'bg-red-600'
      }`}
    >
      <span className="text-white text-lg font-bold leading-none select-none">
        {correct ? '✓' : '✗'}
      </span>
    </div>
  )
}

function YearDot({
  guess,
  delay,
  onAnimationEnd,
}: {
  guess: GuessResult
  delay: number
  onAnimationEnd?: () => void
}) {
  const isCorrect = guess.yearFeedback === 'correct'
  const isClose = !isCorrect && guess.yearAbsDiff <= CLOSE_YEARS
  const colorClass = isCorrect ? 'bg-green-500' : isClose ? 'bg-orange-500' : 'bg-red-600'
  const symbol = isCorrect ? '✓' : guess.yearFeedback === 'too-early' ? '↑' : '↓'

  return (
    <div
      style={{ animationDelay: `${delay}ms` }}
      className={`w-16 h-16 rounded-full animate-dot-flip flex items-center justify-center ${colorClass}`}
      onAnimationEnd={onAnimationEnd}
    >
      <span className="text-white text-lg font-bold leading-none select-none">
        {symbol}
      </span>
    </div>
  )
}

interface Props {
  guesses: GuessResult[]
  onLastDotEnd?: () => void
}

export default function GuessGrid({ guesses, onLastDotEnd }: Props) {
  const lastFilledIdx = guesses.length - 1

  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`grid ${colClass} ${gapClass}`}>
        {(['Category', 'Brand', 'Year'] as const).map(label => (
          <p key={label} className="text-sm font-medium text-gray-400 text-center">
            {label}
          </p>
        ))}
      </div>

      {Array.from({ length: MAX_GUESSES }, (_, i) => {
        const g = guesses[i]
        const isLastFilled = i === lastFilledIdx
        return (
          <div key={i} className={`grid ${colClass} ${gapClass} justify-items-center`}>
            {g ? (
              <>
                <CategoryBrandDot correct={g.categoryCorrect} delay={0} />
                <CategoryBrandDot correct={g.brandCorrect} delay={380} />
                <YearDot
                  guess={g}
                  delay={760}
                  onAnimationEnd={isLastFilled ? onLastDotEnd : undefined}
                />
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

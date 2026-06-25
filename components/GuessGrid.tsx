'use client'

import { GuessResult, CLOSE_YEARS } from '@/lib/gameLogic'

const MAX_GUESSES = 5

function EmptyDot() {
  return <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-gray-700" />
}

function CategoryBrandDot({ correct, delay }: { correct: boolean; delay: number }) {
  return (
    <div
      style={{ animationDelay: `${delay}ms` }}
      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full animate-dot-flip flex items-center justify-center ${
        correct ? 'bg-green-500' : 'bg-red-600'
      }`}
    >
      <span className="text-white text-sm font-bold leading-none select-none">
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
      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full animate-dot-flip flex items-center justify-center ${colorClass}`}
      onAnimationEnd={onAnimationEnd}
    >
      <span className="text-white text-sm font-bold leading-none select-none">
        {symbol}
      </span>
    </div>
  )
}

interface Props {
  guesses: GuessResult[]
  onLastDotEnd?: () => void
}

// Layout: CSS grid, 6 columns (5 fixed dot columns + 1 auto label column), 3 rows.
// Items fill row-by-row: 5 Category dots → label, 5 Brand dots → label, 5 Year dots → label.
// Each submitted guess fills one column; the three dots in that column mount together
// and stagger via animationDelay (0 / 380 / 760 ms), revealing top-to-bottom.
// Keys are field-prefixed so all 18 siblings have unique keys.
export default function GuessGrid({ guesses, onLastDotEnd }: Props) {
  const lastGuessIdx = guesses.length - 1

  return (
    <div
      className={[
        'mx-auto w-fit items-center',
        'grid',
        'grid-cols-[auto_repeat(5,2.25rem)]',
        'gap-x-1.5 gap-y-2',
        'sm:grid-cols-[auto_repeat(5,2.5rem)]',
        'sm:gap-x-2 sm:gap-y-2.5',
      ].join(' ')}
    >
      {/* ── Category row (delay 0 ms) ───────────────────────────────────── */}
      <span className="pr-2 sm:pr-3 text-sm font-medium text-gray-400 whitespace-nowrap">
        Category
      </span>
      {Array.from({ length: MAX_GUESSES }, (_, i) => {
        const g = guesses[i]
        return g
          ? <CategoryBrandDot key={`cat-${i}`} correct={g.categoryCorrect} delay={0} />
          : <EmptyDot key={`cat-${i}`} />
      })}

      {/* ── Brand row (delay 380 ms) ────────────────────────────────────── */}
      <span className="pr-2 sm:pr-3 text-sm font-medium text-gray-400 whitespace-nowrap">
        Brand
      </span>
      {Array.from({ length: MAX_GUESSES }, (_, i) => {
        const g = guesses[i]
        return g
          ? <CategoryBrandDot key={`brand-${i}`} correct={g.brandCorrect} delay={380} />
          : <EmptyDot key={`brand-${i}`} />
      })}

      {/* ── Year row (delay 760 ms) — last dot fires onLastDotEnd ────────── */}
      <span className="pr-2 sm:pr-3 text-sm font-medium text-gray-400 whitespace-nowrap">
        Year
      </span>
      {Array.from({ length: MAX_GUESSES }, (_, i) => {
        const g = guesses[i]
        return g ? (
          <YearDot
            key={`year-${i}`}
            guess={g}
            delay={760}
            onAnimationEnd={i === lastGuessIdx ? onLastDotEnd : undefined}
          />
        ) : (
          <EmptyDot key={`year-${i}`} />
        )
      })}
    </div>
  )
}

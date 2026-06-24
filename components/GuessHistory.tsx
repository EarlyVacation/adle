import { GuessResult } from '@/lib/gameLogic'

interface Props {
  guesses: GuessResult[]
}

export default function GuessHistory({ guesses }: Props) {
  if (guesses.length === 0) return null

  // Most recent guess on top
  const reversed = [...guesses].reverse()

  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-xs text-gray-700 uppercase tracking-wider px-0.5">Past guesses</p>
      {reversed.map((g, ri) => {
        const originalIndex = guesses.length - 1 - ri
        const isLatest = originalIndex === guesses.length - 1
        return (
          <div
            key={originalIndex}
            className={`flex items-center gap-0 px-3 py-1.5 rounded-lg text-xs tabular-nums ${
              isLatest ? 'bg-gray-800 border border-gray-700/60' : 'bg-gray-900 border border-transparent'
            }`}
          >
            {/* Category */}
            <span
              className={`shrink-0 font-bold w-3.5 ${
                g.categoryCorrect ? 'text-green-400' : 'text-red-500'
              }`}
            >
              {g.categoryCorrect ? '✓' : '✗'}
            </span>
            <span
              className={`ml-1 shrink-0 max-w-[5.5rem] overflow-hidden text-ellipsis whitespace-nowrap ${
                g.categoryCorrect ? 'text-green-300' : 'text-gray-500'
              }`}
            >
              {g.category}
            </span>

            <span className="mx-2 text-gray-700 shrink-0">·</span>

            {/* Brand */}
            <span
              className={`shrink-0 font-bold w-3.5 ${
                g.brandCorrect ? 'text-green-400' : 'text-red-500'
              }`}
            >
              {g.brandCorrect ? '✓' : '✗'}
            </span>
            <span
              className={`ml-1 flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap ${
                g.brandCorrect ? 'text-green-300' : 'text-gray-400'
              }`}
            >
              {g.brand}
            </span>

            <span className="mx-2 text-gray-700 shrink-0">·</span>

            {/* Year + direction */}
            <span className="shrink-0 text-gray-400">{g.year}</span>
            <span
              className={`ml-1.5 shrink-0 font-bold text-sm leading-none ${
                g.yearFeedback === 'correct'
                  ? 'text-green-400'
                  : g.yearFeedback === 'too-early'
                  ? 'text-blue-400'
                  : 'text-orange-400'
              }`}
            >
              {g.yearFeedback === 'correct' ? '✓' : g.yearFeedback === 'too-early' ? '↑' : '↓'}
            </span>
          </div>
        )
      })}
    </div>
  )
}

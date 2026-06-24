import { GuessResult } from '@/lib/gameLogic'

interface Props {
  guesses: GuessResult[]
}

const YEAR_FEEDBACK: Record<string, { label: string; cls: string }> = {
  correct:    { label: '✓ correct',   cls: 'text-green-400' },
  'too-early': { label: '→ too early', cls: 'text-yellow-400' },
  'too-late':  { label: '← too late',  cls: 'text-yellow-400' },
}

export default function GuessHistory({ guesses }: Props) {
  if (guesses.length === 0) return null

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-gray-600 uppercase tracking-wider">Previous guesses</p>
      {guesses.map((g, i) => {
        const yf = YEAR_FEEDBACK[g.yearFeedback]
        return (
          <div
            key={i}
            className="bg-gray-900 rounded-lg px-3 py-2.5 flex flex-col gap-1 text-sm"
          >
            <div className="flex items-center gap-2 text-xs">
              <span className={g.categoryCorrect ? 'text-green-400' : 'text-red-400'}>
                {g.categoryCorrect ? '✓' : '✗'}
              </span>
              <span className={g.categoryCorrect ? 'text-green-300' : 'text-gray-400'}>
                {g.category}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex-1 min-w-0 truncate">
                <span className={g.brandCorrect ? 'text-green-400' : 'text-red-400'}>
                  {g.brandCorrect ? '✓' : '✗'}
                </span>{' '}
                <span className="text-gray-200">{g.brand}</span>
              </span>
              <span className="text-gray-400 shrink-0">{g.year}</span>
              <span className={`${yf.cls} text-xs shrink-0`}>{yf.label}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

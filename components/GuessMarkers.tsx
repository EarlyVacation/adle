interface Props {
  guessCount: number
  status: 'playing' | 'won' | 'lost'
}

export default function GuessMarkers({ guessCount, status }: Props) {
  return (
    <div className="flex gap-2.5 justify-center">
      {Array.from({ length: 5 }, (_, i) => {
        let cls = 'w-3.5 h-3.5 rounded-full border-2 transition-colors '
        if (status === 'won' && i === guessCount - 1) {
          cls += 'bg-green-500 border-green-500'
        } else if (i < guessCount) {
          cls += 'bg-gray-500 border-gray-500'
        } else {
          cls += 'bg-transparent border-gray-600'
        }
        return <div key={i} className={cls} />
      })}
    </div>
  )
}

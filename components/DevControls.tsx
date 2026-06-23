import type { Puzzle } from '@/lib/puzzles'

interface Props {
  puzzles: Puzzle[]
  puzzleIndex: number
  onChange: (i: number) => void
}

export default function DevControls({ puzzles, puzzleIndex, onChange }: Props) {
  return (
    <div className="flex items-center gap-2 border border-dashed border-yellow-800/60 rounded-lg px-3 py-2 text-xs text-yellow-700">
      <span className="font-mono font-bold shrink-0">DEV</span>
      <select
        value={puzzleIndex}
        onChange={e => onChange(parseInt(e.target.value, 10))}
        className="bg-transparent text-yellow-700 text-xs flex-1 cursor-pointer focus:outline-none"
      >
        {puzzles.map((p, i) => (
          <option key={p.id} value={i} className="bg-gray-900 text-yellow-600">
            Puzzle {i + 1} — {p.brand} ({p.year})
          </option>
        ))}
      </select>
    </div>
  )
}

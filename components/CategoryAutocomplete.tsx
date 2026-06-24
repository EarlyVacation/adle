'use client'
import { useState, useRef, useEffect } from 'react'
import { PUZZLE_CATEGORIES } from '@/lib/puzzles'

interface Props {
  value: string          // committed/selected category — '' means none selected
  onChange: (v: string) => void
}

export default function CategoryAutocomplete({ value, onChange }: Props) {
  const [text, setText] = useState(value)
  const [open, setOpen] = useState(false)
  const container = useRef<HTMLDivElement>(null)

  // Handle external reset (new puzzle / resetGame)
  useEffect(() => {
    if (value === '') setText('')
  }, [value])

  const filtered = PUZZLE_CATEGORIES.filter(c =>
    text === '' || c.toLowerCase().includes(text.toLowerCase())
  )

  function commit(cat: string) {
    setText(cat)
    onChange(cat)
    setOpen(false)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value
    setText(v)
    setOpen(true)
    const exact = PUZZLE_CATEGORIES.find(c => c.toLowerCase() === v.toLowerCase())
    onChange(exact ?? '')
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && filtered.length > 0) {
      e.preventDefault()
      commit(filtered[0])
    }
    if (e.key === 'Escape') setOpen(false)
  }

  function handleBlur(e: React.FocusEvent) {
    if (!container.current?.contains(e.relatedTarget as Node)) {
      setOpen(false)
      setText(value) // revert to last committed value (or '' if nothing selected)
    }
  }

  return (
    <div ref={container} className="relative" onBlur={handleBlur}>
      <input
        type="text"
        value={text}
        onChange={handleChange}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="e.g. Food"
        autoComplete="off"
        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
      />
      {open && filtered.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-lg max-h-52 overflow-y-auto">
          {filtered.map(cat => (
            <li key={cat}>
              <button
                type="button"
                onMouseDown={e => { e.preventDefault(); commit(cat) }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-700 transition-colors ${
                  cat === value ? 'text-amber-400' : 'text-gray-200'
                }`}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

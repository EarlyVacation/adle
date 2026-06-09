'use client'
import { useState, useEffect } from 'react'
import { PUZZLES } from '@/data/puzzles'
import { evaluateGuess, GuessResult } from '@/lib/gameLogic'
import { getStreak, incrementStreak, resetStreak } from '@/lib/streak'
import StillsDisplay from './StillsDisplay'
import BrandAutocomplete from './BrandAutocomplete'
import GuessMarkers from './GuessMarkers'
import GuessHistory from './GuessHistory'
import DevControls from './DevControls'

type GameStatus = 'playing' | 'won' | 'lost'

const MAX_GUESSES = 5

export default function GameApp() {
  const [puzzleIndex, setPuzzleIndex] = useState(0)
  const [guesses, setGuesses] = useState<GuessResult[]>([])
  const [status, setStatus] = useState<GameStatus>('playing')
  const [revealedStills, setRevealedStills] = useState(1)
  const [streak, setStreak] = useState(0)
  const [brandInput, setBrandInput] = useState('')
  const [yearInput, setYearInput] = useState('')

  useEffect(() => {
    setStreak(getStreak())
  }, [])

  const puzzle = PUZZLES[puzzleIndex]

  function resetGame(newIndex: number) {
    setPuzzleIndex(newIndex)
    setGuesses([])
    setStatus('playing')
    setRevealedStills(1)
    setBrandInput('')
    setYearInput('')
  }

  function handleGuess() {
    if (status !== 'playing') return
    const year = parseInt(yearInput, 10)
    if (!brandInput.trim() || isNaN(year) || year < 1950 || year > 2025) return

    const result = evaluateGuess(puzzle, brandInput.trim(), year)
    const newGuesses = [...guesses, result]
    setGuesses(newGuesses)
    setBrandInput('')
    setYearInput('')

    if (result.isWin) {
      setStatus('won')
      setStreak(incrementStreak())
    } else if (newGuesses.length >= MAX_GUESSES) {
      setStatus('lost')
      resetStreak()
      setStreak(0)
      setRevealedStills(5)
    } else {
      setRevealedStills(s => Math.min(s + 1, 5))
    }
  }

  const yearNum = parseInt(yearInput, 10)
  const yearValid = !isNaN(yearNum) && yearNum >= 1950 && yearNum <= 2025
  const canSubmit = status === 'playing' && brandInput.trim() !== '' && yearValid

  const guessesLeft = MAX_GUESSES - guesses.length

  function submitHint(): string | null {
    if (canSubmit) return null
    const noBrand = brandInput.trim() === ''
    const noYear = yearInput === ''
    const badYear = !noYear && !yearValid
    if (noBrand && noYear) return 'Enter a brand and a year to guess'
    if (noBrand) return 'Enter a brand'
    if (noYear) return 'Enter a year'
    if (badYear) return 'Year must be between 1950 and 2025'
    return null
  }

  return (
    <main className="max-w-lg mx-auto px-4 py-6 flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">Spot the Spot</h1>
        <div className="text-sm">
          <span className="text-gray-500">Streak </span>
          <span className="font-semibold text-white">{streak}</span>
        </div>
      </div>

      {/* Dev controls */}
      <DevControls puzzleIndex={puzzleIndex} onChange={resetGame} />

      {/* Stills */}
      <StillsDisplay stills={puzzle.stills} revealedCount={revealedStills} />

      {/* Guess markers */}
      <GuessMarkers guessCount={guesses.length} status={status} />

      {/* Result banner */}
      {status === 'won' && (
        <div className="bg-green-950/60 border border-green-800 rounded-xl px-4 py-4 text-center">
          <p className="text-green-400 font-semibold text-lg">
            Solved in {revealedStills} {revealedStills === 1 ? 'still' : 'stills'}
          </p>
          <p className="text-green-700 text-sm mt-1">Streak: {streak}</p>
        </div>
      )}

      {status === 'lost' && (
        <div className="bg-red-950/60 border border-red-900 rounded-xl px-4 py-4 text-center">
          <p className="text-red-400 font-semibold">Out of guesses</p>
          <p className="text-gray-300 text-sm mt-1">
            It was{' '}
            <span className="font-bold text-white">{puzzle.brand}</span>
            {', '}
            <span className="font-bold text-white">{puzzle.year}</span>
          </p>
        </div>
      )}

      {/* Guess controls */}
      {status === 'playing' && (
        <div className="flex flex-col gap-3 bg-gray-900/80 rounded-2xl p-4 border border-gray-800">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Brand</label>
            <BrandAutocomplete value={brandInput} onChange={setBrandInput} />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Year (1950–2025)</label>
            <input
              type="number"
              min={1950}
              max={2025}
              value={yearInput}
              onChange={e => setYearInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && canSubmit && handleGuess()}
              placeholder="e.g. 1985"
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>

          <button
            onClick={handleGuess}
            disabled={!canSubmit}
            className="w-full bg-amber-500 hover:bg-amber-400 active:bg-amber-600 disabled:opacity-30 disabled:cursor-not-allowed text-black font-semibold text-sm rounded-xl py-2.5 transition-colors"
          >
            Guess
          </button>

          {canSubmit ? (
            <p className="text-xs text-gray-600 text-center">
              {guessesLeft} {guessesLeft === 1 ? 'guess' : 'guesses'} remaining
            </p>
          ) : (
            <p className="text-xs text-amber-700/80 text-center">{submitHint()}</p>
          )}
        </div>
      )}

      {/* Guess history */}
      <GuessHistory guesses={guesses} />

    </main>
  )
}

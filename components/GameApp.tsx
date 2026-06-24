'use client'
import { useState, useEffect, useRef } from 'react'
import { fetchPuzzles } from '@/lib/fetchPuzzles'
import type { Puzzle } from '@/lib/puzzles'
import { evaluateGuess, GuessResult } from '@/lib/gameLogic'
import CategoryAutocomplete from './CategoryAutocomplete'
import { getStreak, incrementStreak, resetStreak } from '@/lib/streak'
import StillsDisplay from './StillsDisplay'
import BrandAutocomplete from './BrandAutocomplete'
import GuessMarkers from './GuessMarkers'
import GuessGrid from './GuessGrid'
import DevControls from './DevControls'
import PayoffVideo from './PayoffVideo'

type GameStatus = 'playing' | 'won' | 'lost'

const MAX_GUESSES = 5

function getDailyPuzzleIndex(totalPuzzles: number): number {
  const halifaxDate = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Halifax',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
  const dayNumber = Math.floor(Date.parse(halifaxDate + 'T00:00:00Z') / 86_400_000)
  return dayNumber % totalPuzzles
}

export default function GameApp() {
  // ── data ──────────────────────────────────────────────────────────────────
  const [puzzles, setPuzzles] = useState<Puzzle[] | null>(null)
  const [fetchError, setFetchError] = useState<string | null>(null)

  // ── game state ────────────────────────────────────────────────────────────
  const [puzzleIndex, setPuzzleIndex] = useState(0)
  const [guesses, setGuesses] = useState<GuessResult[]>([])
  const [status, setStatus] = useState<GameStatus>('playing')
  const [revealedStills, setRevealedStills] = useState(1)
  const [streak, setStreak] = useState(0)
  const [categoryInput, setCategoryInput] = useState('')
  const [categoryLocked, setCategoryLocked] = useState(false)
  const [lockedCategoryValue, setLockedCategoryValue] = useState('')
  const [brandInput, setBrandInput] = useState('')
  const [yearInput, setYearInput] = useState('')
  const [brandLocked, setBrandLocked] = useState(false)
  const [yearLocked, setYearLocked] = useState(false)
  const [lockedBrandValue, setLockedBrandValue] = useState('')
  const [lockedYearValue, setLockedYearValue] = useState(0)
  const brandInputRef = useRef<HTMLInputElement>(null)
  const yearInputRef = useRef<HTMLInputElement>(null)

  // ── fetch on mount ────────────────────────────────────────────────────────
  useEffect(() => {
    setStreak(getStreak())

    fetchPuzzles()
      .then(fetched => {
        setPuzzles(fetched)
        if (fetched.length === 0) return

        const params = new URLSearchParams(window.location.search)
        const override = params.get('puzzle')
        if (override !== null) {
          const idx = parseInt(override, 10)
          if (!isNaN(idx) && idx >= 0 && idx < fetched.length) {
            setPuzzleIndex(idx)
            return
          }
        }

        setPuzzleIndex(getDailyPuzzleIndex(fetched.length))
      })
      .catch(err => {
        console.error('Failed to fetch puzzles from Supabase:', err)
        setFetchError('Could not load today\'s puzzle. Please check your connection and try again.')
      })
  }, [])

  // ── game actions ──────────────────────────────────────────────────────────
  function resetGame(newIndex: number) {
    setPuzzleIndex(newIndex)
    setGuesses([])
    setStatus('playing')
    setRevealedStills(1)
    setCategoryInput('')
    setCategoryLocked(false)
    setLockedCategoryValue('')
    setBrandInput('')
    setYearInput('')
    setBrandLocked(false)
    setYearLocked(false)
    setLockedBrandValue('')
    setLockedYearValue(0)
  }

  function handleGuess() {
    if (status !== 'playing' || !puzzles) return

    const categoryToUse = categoryLocked ? lockedCategoryValue : categoryInput
    const brandToUse = brandLocked ? lockedBrandValue : brandInput.trim()
    const parsedYear = parseInt(yearInput, 10)
    const yearToUse = yearLocked ? lockedYearValue : parsedYear

    if (!categoryLocked && !categoryToUse) return
    if (!brandLocked && !brandToUse) return
    if (!yearLocked && (isNaN(parsedYear) || parsedYear < 1950 || parsedYear > 2025)) return

    const puzzle = puzzles[puzzleIndex]
    const result = evaluateGuess(puzzle, brandToUse, yearToUse, categoryToUse)
    const newGuesses = [...guesses, result]
    setGuesses(newGuesses)

    let newCategoryLocked = categoryLocked
    let newBrandLocked = brandLocked
    let newYearLocked = yearLocked

    if (!categoryLocked && result.categoryCorrect) {
      setCategoryLocked(true)
      setLockedCategoryValue(categoryToUse)
      newCategoryLocked = true
    }

    if (!brandLocked && result.brandCorrect) {
      setBrandLocked(true)
      setLockedBrandValue(brandToUse)
      newBrandLocked = true
    } else if (!brandLocked) {
      setBrandInput('')
    }

    if (!yearLocked && result.yearFeedback === 'correct') {
      setYearLocked(true)
      setLockedYearValue(yearToUse)
      newYearLocked = true
    } else if (!yearLocked) {
      setYearInput('')
    }

    const won = newCategoryLocked && newBrandLocked && newYearLocked

    if (won) {
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

    setTimeout(() => {
      if (!newBrandLocked) brandInputRef.current?.focus()
      else if (!newYearLocked) yearInputRef.current?.focus()
    }, 0)
  }

  // ── derived ───────────────────────────────────────────────────────────────
  const parsedYear = parseInt(yearInput, 10)
  const yearValid = yearLocked || (!isNaN(parsedYear) && parsedYear >= 1950 && parsedYear <= 2025)
  const brandValid = brandLocked || brandInput.trim() !== ''
  const categoryValid = categoryLocked || categoryInput !== ''
  const canSubmit = status === 'playing' && categoryValid && brandValid && yearValid

  const guessesLeft = MAX_GUESSES - guesses.length

  function submitHint(): string | null {
    if (canSubmit) return null
    const noCategory = !categoryLocked && categoryInput === ''
    const noBrand = !brandLocked && brandInput.trim() === ''
    const noYear = !yearLocked && yearInput === ''
    const badYear = !yearLocked && !noYear && !yearValid
    if (badYear) return 'Year must be between 1950 and 2025'
    const parts: string[] = []
    if (noCategory) parts.push('a category')
    if (noBrand) parts.push('a brand')
    if (noYear) parts.push('a year')
    if (parts.length === 0) return null
    return `Enter ${parts.join(' and ')} to guess`
  }

  // ── shell (always rendered, shared by all states) ─────────────────────────
  const shell = (children: React.ReactNode) => (
    <main className="max-w-lg mx-auto px-4 py-6 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">Adle</h1>
        <div className="text-sm">
          <span className="text-gray-500">Streak </span>
          <span className="font-semibold text-white">{streak}</span>
        </div>
      </div>
      {children}
    </main>
  )

  // ── loading / error ───────────────────────────────────────────────────────
  if (fetchError) {
    return shell(<p className="text-red-400 text-sm text-center py-12">{fetchError}</p>)
  }

  if (puzzles === null) {
    return shell(<p className="text-gray-500 text-sm text-center py-12">Loading…</p>)
  }

  if (puzzles.length === 0) {
    return shell(
      <p className="text-gray-400 text-sm text-center py-12">No puzzle today — check back soon.</p>
    )
  }

  // ── game ──────────────────────────────────────────────────────────────────
  const puzzle = puzzles[puzzleIndex]

  return (
    <main className="max-w-lg mx-auto px-4 py-6 flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">Adle</h1>
        <div className="text-sm">
          <span className="text-gray-500">Streak </span>
          <span className="font-semibold text-white">{streak}</span>
        </div>
      </div>

      {process.env.NODE_ENV === 'development' && (
        <DevControls puzzles={puzzles} puzzleIndex={puzzleIndex} onChange={resetGame} />
      )}

      {/* Stills */}
      <StillsDisplay stills={puzzle.stills} revealedCount={revealedStills} />

      {/* Guess markers */}
      <GuessMarkers guessCount={guesses.length} status={status} />

      {/* Result banner */}
      {status === 'won' && (
        <div className="bg-green-950/60 border border-green-800 rounded-xl px-4 py-4">
          <p className="text-green-400 font-semibold text-lg text-center">
            Solved in {revealedStills} {revealedStills === 1 ? 'still' : 'stills'}
          </p>
          <p className="text-green-700 text-sm mt-1 text-center">Streak: {streak}</p>
          {puzzle.videoUrl && <PayoffVideo url={puzzle.videoUrl} />}
        </div>
      )}

      {status === 'lost' && (
        <div className="bg-red-950/60 border border-red-900 rounded-xl px-4 py-4">
          <p className="text-red-400 font-semibold text-center">Out of guesses</p>
          <p className="text-gray-300 text-sm mt-1 text-center">
            It was{' '}
            <span className="font-bold text-white">{puzzle.brand}</span>
            {', '}
            <span className="font-bold text-white">{puzzle.year}</span>
            {' · '}
            <span className="font-bold text-white">{puzzle.category}</span>
          </p>
          {puzzle.videoUrl && <PayoffVideo url={puzzle.videoUrl} />}
        </div>
      )}

      {/* Guess grid — always visible, reveals rows as guesses are submitted */}
      <GuessGrid guesses={guesses} />

      {/* Guess controls */}
      {status === 'playing' && (
        <div className="flex flex-col gap-3 bg-gray-900/80 rounded-2xl p-4 border border-gray-800">

          {/* Category */}
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Category</label>
            {categoryLocked ? (
              <div className="animate-lock-pop w-full bg-green-900/30 border border-green-600/60 rounded-lg px-3 py-2 text-sm flex items-center gap-2">
                <span className="text-green-400 font-bold">✓</span>
                <span className="text-green-300 font-medium">{lockedCategoryValue}</span>
              </div>
            ) : (
              <CategoryAutocomplete value={categoryInput} onChange={setCategoryInput} />
            )}
          </div>

          {/* Brand */}
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Brand</label>
            {brandLocked ? (
              <div className="animate-lock-pop w-full bg-green-900/30 border border-green-600/60 rounded-lg px-3 py-2 text-sm flex items-center gap-2">
                <span className="text-green-400 font-bold">✓</span>
                <span className="text-green-300 font-medium">{lockedBrandValue}</span>
              </div>
            ) : (
              <BrandAutocomplete ref={brandInputRef} value={brandInput} onChange={setBrandInput} />
            )}
          </div>

          {/* Year */}
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Year (1950–2025)</label>
            {yearLocked ? (
              <div className="animate-lock-pop w-full bg-green-900/30 border border-green-600/60 rounded-lg px-3 py-2 text-sm flex items-center gap-2">
                <span className="text-green-400 font-bold">✓</span>
                <span className="text-green-300 font-medium">{lockedYearValue}</span>
              </div>
            ) : (
              <input
                ref={yearInputRef}
                type="number"
                min={1950}
                max={2025}
                value={yearInput}
                onChange={e => setYearInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && canSubmit && handleGuess()}
                placeholder="e.g. 1985"
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            )}
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

      {/* Puzzle navigation */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => resetGame((puzzleIndex - 1 + puzzles.length) % puzzles.length)}
          aria-label="Previous puzzle"
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 active:bg-gray-600 text-gray-400 hover:text-white transition-colors text-lg leading-none select-none"
        >
          ‹
        </button>
        <span className="text-xs text-gray-500 tabular-nums">
          {puzzleIndex + 1} / {puzzles.length}
        </span>
        <button
          onClick={() => resetGame((puzzleIndex + 1) % puzzles.length)}
          aria-label="Next puzzle"
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 active:bg-gray-600 text-gray-400 hover:text-white transition-colors text-lg leading-none select-none"
        >
          ›
        </button>
      </div>

    </main>
  )
}

import { Puzzle } from './puzzles'

export type YearFeedback = 'correct' | 'too-early' | 'too-late'

export type GuessResult = {
  brand: string
  year: number
  category: string
  brandCorrect: boolean
  yearFeedback: YearFeedback
  categoryCorrect: boolean
  isWin: boolean
}

export function normalize(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[-'‘’.&]/g, '') // hyphens, apostrophes (straight + curly), periods, ampersands
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^the\s+/, '')                   // strip leading "the"
    .replace(/\s+(inc|co|company|corp)\.?$/, '') // strip trailing legal suffixes
    .trim()
}

function levenshtein(a: string, b: string): number {
  const n = b.length
  const row = Array.from({ length: n + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0]
    row[0] = i
    for (let j = 1; j <= n; j++) {
      const tmp = row[j]
      row[j] = a[i - 1] === b[j - 1]
        ? prev
        : 1 + Math.min(prev, row[j], row[j - 1])
      prev = tmp
    }
  }
  return row[n]
}

export function evaluateGuess(puzzle: Puzzle, brand: string, year: number, category: string): GuessResult {
  const normGuess = normalize(brand)
  const allNorms = [normalize(puzzle.brand), ...puzzle.brandAliases.map(normalize)]

  let brandCorrect = allNorms.some(n => n === normGuess)

  if (!brandCorrect) {
    brandCorrect = allNorms.some(n =>
      n.length > 4 && normGuess.length > 4 && levenshtein(n, normGuess) <= 1
    )
  }

  const yearDiff = year - puzzle.year
  const yearWithinRange = yearDiff === 0
  let yearFeedback: YearFeedback
  if (yearWithinRange) {
    yearFeedback = 'correct'
  } else if (yearDiff < 0) {
    yearFeedback = 'too-early'
  } else {
    yearFeedback = 'too-late'
  }

  const categoryCorrect = category === puzzle.category

  return {
    brand, year, category,
    brandCorrect, yearFeedback, categoryCorrect,
    isWin: brandCorrect && yearWithinRange && categoryCorrect,
  }
}

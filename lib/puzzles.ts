export type PuzzleCategory =
  | 'Food' | 'Drink' | 'Auto' | 'Tech' | 'Clothing'
  | 'Retail' | 'Finance' | 'Entertainment' | 'Health/Beauty' | 'Travel'
  | 'Uncategorized'

// The selectable categories for the admin form — excludes 'Uncategorized'
export const PUZZLE_CATEGORIES = [
  'Food', 'Drink', 'Auto', 'Tech', 'Clothing',
  'Retail', 'Finance', 'Entertainment', 'Health/Beauty', 'Travel',
] as const satisfies ReadonlyArray<PuzzleCategory>

export type Puzzle = {
  id: string
  brand: string
  brandAliases: string[]
  category: PuzzleCategory
  year: number
  stills: string[]
  videoUrl: string | null
}


import { supabase } from './supabase'
import type { Puzzle } from './puzzles'

interface PuzzleRow {
  id: string
  brand: string
  brand_aliases: string[] | null
  category: string | null
  year: number
  still_urls: string[] | null
  video_url: string | null
}

export async function fetchPuzzles(): Promise<Puzzle[]> {
  const { data, error } = await supabase
    .from('puzzles')
    .select('id, brand, brand_aliases, category, year, still_urls, video_url')
    .order('sort_order', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: true })

  if (error) throw error

  return (data as PuzzleRow[]).map(row => ({
    id: row.id,
    brand: row.brand,
    brandAliases: row.brand_aliases ?? [],
    category: row.category ?? '',
    year: row.year,
    stills: row.still_urls ?? [],
    videoUrl: row.video_url,
  }))
}

/**
 * One-time migration: upload local puzzle stills to Supabase Storage and
 * insert puzzle rows into the `puzzles` table.
 *
 * Run with:
 *   npm run migrate
 *   npx tsx scripts/migrate.ts
 *
 * Requires in .env.local (already gitignored):
 *   NEXT_PUBLIC_SUPABASE_URL=...
 *   SUPABASE_SERVICE_ROLE_KEY=...    ← service_role key, NOT the anon key
 *
 * Safe to re-run: existing DB rows (matched on brand + year) and already-
 * uploaded images are skipped, not duplicated.
 */

import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

// ── Inline .env.local loader (no dotenv dependency needed) ──────────────────
;(function loadEnvLocal() {
  const envPath = path.resolve(process.cwd(), '.env.local')
  if (!fs.existsSync(envPath)) return
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const eq = t.indexOf('=')
    if (eq < 1) continue
    const k = t.slice(0, eq).trim()
    const v = t.slice(eq + 1).trim().replace(/^["']|["']$/g, '')
    if (!(k in process.env)) process.env[k] = v
  }
})()

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error(
    '\n✗  Missing env vars.\n' +
    '   Add these to .env.local:\n' +
    '     NEXT_PUBLIC_SUPABASE_URL=...\n' +
    '     SUPABASE_SERVICE_ROLE_KEY=...\n'
  )
  process.exit(1)
}

// Service role key — used server-side only, never in client/browser code.
const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// ── Puzzle data (inlined from data/puzzles.ts to avoid @/ path alias) ───────

interface PuzzleEntry {
  brand: string
  brandAliases: string[]
  category?: string
  year: number
  stills: string[]   // public/-relative paths, e.g. /puzzles/apple-2018/1.png
  videoUrl: string | null
}

const PUZZLES: PuzzleEntry[] = [
  {
    brand: 'Apple',
    brandAliases: [],
    year: 2018,
    stills: [
      '/puzzles/apple-welcome-home-2018/1.png',
      '/puzzles/apple-welcome-home-2018/2.png',
      '/puzzles/apple-welcome-home-2018/3.png',
      '/puzzles/apple-welcome-home-2018/4.png',
      '/puzzles/apple-welcome-home-2018/5.png',
    ],
    videoUrl: 'https://www.youtube.com/watch?v=Xwc22EK8qE0&list=RDXwc22EK8qE0&start_radio=1',
  },
  {
    brand: 'Pepsi',
    brandAliases: [],
    year: 2018,
    stills: [
      '/puzzles/pepsi-2018/1.png',
      '/puzzles/pepsi-2018/2.png',
      '/puzzles/pepsi-2018/3.png',
      '/puzzles/pepsi-2018/4.png',
      '/puzzles/pepsi-2018/5.png',
    ],
    videoUrl: 'https://www.youtube.com/watch?v=tJCcnkqnjqU',
  },
  {
    brand: 'Mitsubishi',
    brandAliases: [],
    year: 2021,
    stills: [
      '/puzzles/bob-mills-mitsubishi-2021/1.png',
      '/puzzles/bob-mills-mitsubishi-2021/2.png',
      '/puzzles/bob-mills-mitsubishi-2021/3.png',
      '/puzzles/bob-mills-mitsubishi-2021/4.png',
      '/puzzles/bob-mills-mitsubishi-2021/5.png',
    ],
    videoUrl: 'https://www.youtube.com/watch?v=uQdqx5hA28g',
  },
  {
    brand: 'Lays',
    brandAliases: [],
    year: 2025,
    stills: [
      '/puzzles/lays-2025/1.png',
      '/puzzles/lays-2025/2.png',
      '/puzzles/lays-2025/3.png',
      '/puzzles/lays-2025/4.png',
      '/puzzles/lays-2025/5.png',
    ],
    videoUrl: 'https://www.youtube.com/watch?v=EBnLXlvrNng&pp=ygUVbGF5cyBjaGlwcyBjb21tZXJjaWFs',
  },
  {
    brand: 'Mountain Dew',
    brandAliases: [],
    year: 2025,
    stills: [
      '/puzzles/mountain-dew-2025/1.png',
      '/puzzles/mountain-dew-2025/2.png',
      '/puzzles/mountain-dew-2025/3.png',
      '/puzzles/mountain-dew-2025/4.png',
      '/puzzles/mountain-dew-2025/5.png',
    ],
    videoUrl: 'https://www.youtube.com/watch?v=h5L9-wNnPOA&pp=ygUUYmFqIGJsYXN0IGNvbW1lcmNpYWw%3D',
  },
  {
    brand: 'Little Caesars',
    brandAliases: [],
    year: 2020,
    stills: [
      '/puzzles/little-caesars-2020/1.png',
      '/puzzles/little-caesars-2020/2.png',
      '/puzzles/little-caesars-2020/3.png',
      '/puzzles/little-caesars-2020/4.png',
      '/puzzles/little-caesars-2020/5.png',
    ],
    videoUrl: 'https://www.youtube.com/watch?v=Xwc22EK8qE0&list=RDXwc22EK8qE0&start_radio=1',
  },
  {
    brand: 'Nutrigrain',
    brandAliases: [],
    year: 2006,
    stills: [
      '/puzzles/nutrigrain-2006/1.png',
      '/puzzles/nutrigrain-2006/2.png',
      '/puzzles/nutrigrain-2006/3.png',
      '/puzzles/nutrigrain-2006/4.png',
      '/puzzles/nutrigrain-2006/5.png',
    ],
    videoUrl: 'https://www.youtube.com/watch?v=Y6rE0EakhG8',
  },
]

// ── Helpers ──────────────────────────────────────────────────────────────────

const BUCKET = 'stills'
const PUBLIC_DIR = path.resolve(process.cwd(), 'public')

function mimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase()
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg'
  if (ext === '.webp') return 'image/webp'
  return 'image/png'
}

// "/puzzles/apple-welcome-home-2018/1.png"  →  "apple-welcome-home-2018/1.png"
function publicPathToStoragePath(publicPath: string): string {
  return publicPath.replace(/^\/puzzles\//, '')
}

async function uploadStill(publicPath: string): Promise<{ url: string; uploaded: boolean }> {
  const storagePath = publicPathToStoragePath(publicPath)
  const folder   = path.dirname(storagePath)    // "apple-welcome-home-2018"
  const filename = path.basename(storagePath)   // "1.png"

  // Check whether this file is already in the bucket
  const { data: existing } = await supabase.storage.from(BUCKET).list(folder)
  const alreadyExists = existing?.some(f => f.name === filename) ?? false

  if (!alreadyExists) {
    const diskPath = path.join(PUBLIC_DIR, 'puzzles', folder, filename)
    if (!fs.existsSync(diskPath)) {
      throw new Error(`Local file not found: ${diskPath}`)
    }
    const fileBuffer = fs.readFileSync(diskPath)
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, fileBuffer, { contentType: mimeType(filename), upsert: false })
    if (error) throw new Error(`Storage upload failed for ${storagePath}: ${error.message}`)
  }

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(storagePath)
  return { url: urlData.publicUrl, uploaded: !alreadyExists }
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\nAdle migration — ${PUZZLES.length} puzzles to process\n`)

  let inserted      = 0
  let skipped       = 0
  let imagesUploaded = 0
  const errors: string[] = []

  for (let i = 0; i < PUZZLES.length; i++) {
    const p = PUZZLES[i]
    const label = `${p.brand} (${p.year})`

    // 1. Check if this puzzle already exists in the DB ──────────────────────
    const { data: existing, error: selectErr } = await supabase
      .from('puzzles')
      .select('id')
      .eq('brand', p.brand)
      .eq('year', p.year)
      .maybeSingle()

    if (selectErr) {
      console.error(`  ✗  [${label}] DB check failed: ${selectErr.message}`)
      errors.push(label)
      continue
    }

    if (existing) {
      console.log(`  –  [${label}] already in DB, skipping`)
      skipped++
      continue
    }

    // 2. Upload stills to Storage ───────────────────────────────────────────
    const stillUrls: string[] = []
    let puzzleHasError = false

    for (const stillPath of p.stills) {
      try {
        const { url, uploaded } = await uploadStill(stillPath)
        stillUrls.push(url)
        if (uploaded) {
          imagesUploaded++
          console.log(`     ↑  uploaded  ${stillPath}`)
        } else {
          console.log(`     ○  exists    ${stillPath}`)
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err)
        console.error(`  ✗  [${label}] image error: ${msg}`)
        errors.push(`${label} — ${stillPath}`)
        puzzleHasError = true
      }
    }

    if (puzzleHasError) continue

    // 3. Insert puzzle row ──────────────────────────────────────────────────
    const { error: insertErr } = await supabase.from('puzzles').insert({
      brand:         p.brand,
      brand_aliases: p.brandAliases,
      category:      p.category ?? null,
      year:          p.year,
      still_urls:    stillUrls,
      video_url:     p.videoUrl,
      sort_order:    i + 1,
    })

    if (insertErr) {
      console.error(`  ✗  [${label}] DB insert failed: ${insertErr.message}`)
      errors.push(label)
      continue
    }

    console.log(`  ✓  [${label}] inserted (sort_order ${i + 1})`)
    inserted++
  }

  // ── Summary ────────────────────────────────────────────────────────────────
  console.log('\n─────────────────────────────────')
  console.log(`  Puzzles inserted : ${inserted}`)
  console.log(`  Puzzles skipped  : ${skipped}`)
  console.log(`  Images uploaded  : ${imagesUploaded}`)
  console.log(`  Errors           : ${errors.length}`)
  if (errors.length > 0) {
    console.log('\n  Error details:')
    errors.forEach(e => console.log(`    ✗ ${e}`))
    console.log()
  }
  console.log('─────────────────────────────────\n')

  process.exit(errors.length > 0 ? 1 : 0)
}

main().catch(err => {
  console.error('\nFatal:', err)
  process.exit(1)
})

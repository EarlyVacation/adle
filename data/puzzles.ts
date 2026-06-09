/*
 * HOW TO ADD A NEW PUZZLE
 * =======================
 * 1. Create a folder:  public/puzzles/<id>/
 *    Naming convention: <brand-slug>-<year>  e.g. budweiser-1995
 *
 * 2. Add still frames named 1.jpg – 5.jpg, ordered most cryptic → most obvious.
 *    You can start with fewer than 5 frames — missing images fall back to a
 *    labeled placeholder box automatically, so you can fill in stills over time.
 *
 * 3. Add a Puzzle object to the array below:
 *
 *    {
 *      id: 'budweiser-1995',
 *      brand: 'Budweiser',      // canonical answer (case-insensitive match)
 *      brandAliases: ['Bud'],   // accepted alternate spellings
 *      year: 1995,
 *      stills: [
 *        '/puzzles/budweiser-1995/1.jpg',
 *        '/puzzles/budweiser-1995/2.jpg',
 *        '/puzzles/budweiser-1995/3.jpg',
 *        '/puzzles/budweiser-1995/4.jpg',
 *        '/puzzles/budweiser-1995/5.jpg',
 *      ],
 *    },
 */

import { Puzzle } from '@/lib/puzzles'

export const PUZZLES: Puzzle[] = [
  {
    id: 'Doritos-2015',
    brand: 'Doritos',
    brandAliases: ['Doritos'],
    year: 2015,
    stills: [
      '/puzzles/doritos-2015/1.png',
      '/puzzles/doritos-2015/2.png',
      '/puzzles/doritos-2015/3.png',
      '/puzzles/doritos-2015/4.png',
      '/puzzles/doritos-2015/5.png',
    ],
  },
  {
    id: 'pepsi-2018',
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
  },
  {
    id: 'lays-2025',
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
  },
]

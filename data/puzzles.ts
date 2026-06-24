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
 *      videoUrl: 'https://www.youtube.com/watch?v=XXXXXXXXXXX',
 *    },
 */

import { Puzzle, PuzzleCategory } from '@/lib/puzzles'

export const PUZZLES: Puzzle[] = [
  {
    id: 'Apple Welcome Home',
    brand: 'Apple',
    brandAliases: [],
    category: 'Tech' as PuzzleCategory,
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
    id: '2',
    brand: 'Pepsi',
    brandAliases: [],
    category: 'Drink' as PuzzleCategory,
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
    id: 'Bob Mills Mitsubishi',
    brand: 'Mitsubishi',
    brandAliases: [],
    category: 'Auto' as PuzzleCategory,
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
    id: '3',
    brand: 'Lays',
    brandAliases: [],
    category: 'Food' as PuzzleCategory,
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
    id: 'Mountain Dew - Baja',
    brand: 'Mountain Dew',
    brandAliases: [],
    category: 'Drink' as PuzzleCategory,
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
    id: 'Little Caesars - sliced Bread',
    brand: 'Little Caesars',
    brandAliases: [],
    category: 'Food' as PuzzleCategory,
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
    id: 'Nutrigrain',
    brand: 'Nutrigrain',
    brandAliases: [],
    category: 'Food' as PuzzleCategory,
    year: 2006,
    stills: [
      '/puzzles/nutrigrain-2006/1.png',
      '/puzzles/nutrigrain-2006/2.png',
      '/puzzles/nutrigrain-2006/3.png',
      '/puzzles/nutrigrain-2006/4.png',
      '/puzzles/nutrigrain-2006/5.png',
    ],
    videoUrl: 'https://www.youtube.com/watch?v=Y6rE0EakhG8',
   }
]

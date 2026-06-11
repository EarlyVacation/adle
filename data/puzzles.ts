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

import { Puzzle } from '@/lib/puzzles'

export const PUZZLES: Puzzle[] = [
  {
    id: '1',
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
    videoUrl: 'https://youtu.be/X96RjH8WC5o?si=QS7Kei6NiDEZnoFT',
  },
  {
    id: '2',
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
    id: '3',
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
    id: 'Apple Welcome Home',
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
    id: 'Mountain Dew',
    brand: 'Mountain Dew',
    brandAliases: [],
    year: 2025,
    stills: [
      '/puzzles/mountain-dew-2025/1.png',
      '/puzzles/mountain-dew-20258/2.png',
      '/puzzles/mountain-dew-2025/3.png',
      '/puzzles/mountain-dew-2025/4.png',
      '/puzzles/mountain-dew-2025/5.png',
    ],
    videoUrl: 'https://www.youtube.com/watch?v=Xwc22EK8qE0&list=RDXwc22EK8qE0&start_radio=1',
   },
id: 'Mountain Dew',
    brand: 'Mountain Dew',
    brandAliases: [],
    year: 2025,
    stills: [
      '/puzzles/little-caesars-2020/1.png',
      '/puzzles/little-caesars-2020/2.png',
      '/puzzles/little-caesars-2020/3.png',
      '/puzzles/little-caesars-2020/4.png',
      '/puzzles/little-caesars-2020/5.png',
    ],
    videoUrl: 'https://www.youtube.com/watch?v=Xwc22EK8qE0&list=RDXwc22EK8qE0&start_radio=1',
   }

]

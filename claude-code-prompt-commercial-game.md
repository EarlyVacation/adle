# Build: gameplay prototype for a daily commercial-guessing game

Working title: **"Spot the Spot"** (a "spot" = a commercial — feel free to rename).

## Goal
Build a clickable **front-end prototype of the core gameplay loop only**. No database, no backend, no admin tool, no accounts, no sharing — those come later. Use 3 hardcoded dummy puzzles and placeholder images so I can feel whether the reveal-and-guess loop is fun before I build any real content pipeline.

## Stack
- Next.js (App Router) + TypeScript + Tailwind CSS
- All game state in React; persist **only the streak** in `localStorage`
- Placeholder stills: labeled colored/gradient boxes ("Still 1" … "Still 5"). No real image assets needed.

## The game
One puzzle = one commercial. The player must guess the **brand AND the year it aired**. They get up to **5 guesses**. Only the **first still** is shown initially; each **wrong** guess reveals the **next** still (each one more revealing than the last).

A guess is a pair:
- **Brand** — chosen from an **autocomplete typeahead** backed by a hardcoded brand list (filter as the user types, click to select).
- **Year** — number input (range ~1950–2025).

Per-guess scoring & feedback:
- **Win only if BOTH** the brand is correct **AND** the year is **within ±2** of the answer.
- **Brand feedback:** right / wrong.
- **Year feedback:** "correct" if within ±2; otherwise a directional nudge — **"too early"** or **"too late."** Do **not** reveal the exact year.
- On a **wrong** guess with guesses remaining: reveal the next still and keep all previously revealed stills visible.
- After **5 wrong guesses:** game over — reveal the answer (brand + year) and all 5 stills.

Result:
- On win, show **"Solved in N stills."**
- **Streak** in `localStorage`: a solve increments it by 1, a loss resets it to 0. Display the current streak.

## Data shape
Define a `Puzzle` type and an array of **3 dummy puzzles**:

```ts
type Puzzle = {
  id: string
  brand: string            // canonical answer, e.g. "Coca-Cola"
  brandAliases: string[]   // accepted alternates, e.g. ["Coke"]
  year: number             // answer year
  stills: string[]         // 5 entries, ordered cryptic -> obvious (placeholders fine)
}
```

Also define `BRANDS: string[]` (~40 well-known brands) to feed the autocomplete — include the 3 answer brands plus decoys so the dropdown isn't a giveaway.

## Dev affordance
The real game is one puzzle per calendar day, but for testing I want to replay freely: add a small **dev-only dropdown or "Next puzzle" button** (clearly labeled as a dev control) to switch between the 3 hardcoded puzzles. Real puzzle-of-the-day scheduling is out of scope.

## Look & feel
Clean, uncluttered, mobile-friendly, single centered column. Current/revealed stills stacked or in a small filmstrip; guess controls below; a row of 5 markers showing guesses used vs. remaining. Tasteful, not flashy.

## Out of scope — do NOT build
Backend/database, image uploads, admin/authoring tool, user accounts/login, share-result feature, real puzzle-of-the-day scheduling.

## Done when
- I can load the app, see one cryptic still, and submit a brand + year guess.
- Wrong guesses reveal the next still and show brand/year feedback with a too-early / too-late nudge.
- Getting both right within 5 guesses shows a win with the still count; running out reveals the answer.
- The streak persists across page reloads via `localStorage`.

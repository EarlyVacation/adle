# Puzzle folder convention

Each puzzle lives in its own folder named `<brand-slug>-<year>`.
Drop still frames here as `1.jpg` through `5.jpg`, ordered from most cryptic
(no brand identifiers) to most obvious (brand name / logo visible):

```
example-1985/
  1.jpg   ← cryptic — abstract shot, nothing identifying
  2.jpg
  3.jpg
  4.jpg
  5.jpg   ← obvious — logo, tagline, or brand name on screen
```

Then add a matching `Puzzle` entry in `data/puzzles.ts` with stills paths like:
`/puzzles/example-1985/1.jpg`

You can start with fewer than 5 frames — any missing image automatically falls
back to a labeled placeholder box in the UI so you can add frames incrementally.

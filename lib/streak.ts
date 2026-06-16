const KEY = 'adle_streak'

export function getStreak(): number {
  if (typeof window === 'undefined') return 0
  return parseInt(localStorage.getItem(KEY) ?? '0', 10)
}

export function incrementStreak(): number {
  const next = getStreak() + 1
  localStorage.setItem(KEY, String(next))
  return next
}

export function resetStreak(): void {
  localStorage.setItem(KEY, '0')
}

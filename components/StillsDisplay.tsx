'use client'
import { useState, useEffect } from 'react'

interface Props {
  stills: string[]
  revealedCount: number
}

const STILL_GRADIENTS = [
  'from-gray-950 to-zinc-900',
  'from-zinc-900 to-slate-800',
  'from-slate-800 to-slate-700',
  'from-slate-700 to-stone-700',
  'from-stone-700 to-amber-900',
]

function Still({ index, src }: { index: number; src: string }) {
  const [failed, setFailed] = useState(false)

  // Reset error state when the src changes (e.g. puzzle switch)
  useEffect(() => { setFailed(false) }, [src])

  return (
    <div
      className={`relative w-full aspect-video rounded-xl bg-gradient-to-br ${STILL_GRADIENTS[index]} border border-white/10 overflow-hidden`}
    >
      <span className="absolute top-2 left-3 z-10 text-xs text-white/30 font-mono select-none">
        {index + 1} / 5
      </span>
      {src && !failed ? (
        <img
          src={src}
          alt={`Still ${index + 1}`}
          onError={() => setFailed(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          <p className="text-white/25 text-sm font-mono">Still {index + 1}</p>
        </div>
      )}
    </div>
  )
}

export default function StillsDisplay({ stills, revealedCount }: Props) {
  return (
    <div className="flex flex-col gap-2">
      {stills.slice(0, revealedCount).map((src, i) => (
        <Still key={src} index={i} src={src} />
      ))}
    </div>
  )
}

'use client'
import { useState, useEffect, useRef } from 'react'

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

function Still({ index, src, onExpand }: { index: number; src: string; onExpand: () => void }) {
  const [failed, setFailed] = useState(false)
  useEffect(() => { setFailed(false) }, [src])

  return (
    <div
      className={`relative flex-shrink-0 w-[80%] aspect-video rounded-xl snap-start bg-gradient-to-br ${STILL_GRADIENTS[index]} border border-white/10 overflow-hidden cursor-pointer active:opacity-90`}
      onClick={onExpand}
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
  const stripRef = useRef<HTMLDivElement>(null)
  const [lightbox, setLightbox] = useState<string | null>(null)

  // Auto-scroll to the newest still when it's revealed
  useEffect(() => {
    const el = stripRef.current
    if (!el || revealedCount === 0) return
    const last = el.children[revealedCount - 1] as HTMLElement | undefined
    if (last) el.scrollTo({ left: last.offsetLeft, behavior: 'smooth' })
  }, [revealedCount])

  return (
    <>
      <div
        ref={stripRef}
        className="flex gap-2 overflow-x-auto snap-x snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
      >
        {stills.slice(0, revealedCount).map((src, i) => (
          <Still key={src} index={i} src={src} onExpand={() => setLightbox(src)} />
        ))}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <img
            src={lightbox}
            alt="Still enlarged"
            className="max-w-full max-h-full rounded-xl object-contain"
          />
        </div>
      )}
    </>
  )
}

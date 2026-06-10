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
      // w-[90vw] max-w-[700px]: viewport-relative so frames are truly large.
      // On mobile: ~337px; on desktop: up to 700px (double the old 420px cap).
      className={`relative flex-none w-[90vw] max-w-[700px] aspect-video rounded-xl snap-start bg-gradient-to-br ${STILL_GRADIENTS[index]} border border-white/10 overflow-hidden cursor-pointer active:opacity-90`}
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

  useEffect(() => {
    const el = stripRef.current
    if (!el || revealedCount === 0) return
    const last = el.children[revealedCount - 1] as HTMLElement | undefined
    if (last) el.scrollTo({ left: last.offsetLeft, behavior: 'smooth' })
  }, [revealedCount])

  function scrollBy(dir: -1 | 1) {
    const el = stripRef.current
    if (!el) return
    const frame = el.firstElementChild as HTMLElement | null
    const step = frame ? frame.offsetWidth + 12 : el.clientWidth
    el.scrollBy({ left: dir * step, behavior: 'smooth' })
  }

  return (
    <>
      {/*
        Full-bleed wrapper:
        - w-screen + left-[calc(-50vw+50%)] expands from max-w-lg to full viewport
          width regardless of the centering offset of the parent container.
        - [overflow:clip] prevents the wider element from triggering a body-level
          horizontal scrollbar; unlike overflow:hidden it doesn't create a new
          scroll container, so the inner strip can still scroll independently.
      */}
      <div className="relative w-screen left-[calc(-50vw+50%)] [overflow:clip]">

        {/* Arrow buttons — desktop/pointer devices only */}
        <button
          onClick={() => scrollBy(-1)}
          aria-label="Previous still"
          className="hidden md:flex items-center justify-center absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/60 border border-white/10 text-white/70 hover:text-white hover:bg-black/80 transition-colors text-2xl select-none"
        >
          ‹
        </button>
        <button
          onClick={() => scrollBy(1)}
          aria-label="Next still"
          className="hidden md:flex items-center justify-center absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/60 border border-white/10 text-white/70 hover:text-white hover:bg-black/80 transition-colors text-2xl select-none"
        >
          ›
        </button>

        {/* Scrollable strip — pl/pr align content with the page's text column */}
        <div
          ref={stripRef}
          className="flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth pl-4 pr-4 pb-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
        >
          {stills.slice(0, revealedCount).map((src, i) => (
            <Still key={src} index={i} src={src} onExpand={() => setLightbox(src)} />
          ))}
        </div>
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

'use client'

import { useState, useEffect, useRef } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { PUZZLE_CATEGORIES, type PuzzleCategory } from '@/lib/puzzles'

// ── types ─────────────────────────────────────────────────────────────────────

type StillItem =
  | { kind: 'existing'; id: string; url: string }
  | { kind: 'new'; id: string; file: File; preview: string }

interface PuzzleRow {
  id: string
  brand: string
  brand_aliases: string[] | null
  year: number
  category: string
  still_urls: string[] | null
  video_url: string | null
}

// ── utilities ─────────────────────────────────────────────────────────────────

async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const MAX_W = 1200
      const scale = Math.min(1, MAX_W / img.naturalWidth)
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.naturalWidth * scale)
      canvas.height = Math.round(img.naturalHeight * scale)
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('Compression failed'))),
        'image/jpeg',
        0.85,
      )
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image'))
    }
    img.src = url
  })
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

// "/stills/apple-2018-xxx/1.jpg"  →  "apple-2018-xxx/1.jpg"
function urlToStoragePath(url: string): string {
  const marker = '/stills/'
  const idx = url.indexOf(marker)
  return idx >= 0 ? url.slice(idx + marker.length) : ''
}

// "apple-2018-xxx/1.jpg"  →  "apple-2018-xxx"
function folderFromUrl(url: string): string {
  return urlToStoragePath(url).split('/')[0]
}

// ── shared UI ─────────────────────────────────────────────────────────────────

const inputCls =
  'w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gray-500'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1.5">{label}</label>
      {children}
    </div>
  )
}

// ── root ──────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, s) => setSession(s))
    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-sm">Loading…</p>
      </div>
    )
  }

  return session ? <Dashboard /> : <SignIn />
}

// ── sign-in ───────────────────────────────────────────────────────────────────

function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-gray-900 border border-gray-800 rounded-2xl p-8 flex flex-col gap-4"
      >
        <h1 className="text-lg font-bold text-white">Adle Admin</h1>
        <Field label="Email">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className={inputCls}
          />
        </Field>
        <Field label="Password">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className={inputCls}
          />
        </Field>
        {error && <p className="text-red-400 text-xs">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black font-semibold text-sm rounded-xl py-2.5 transition-colors"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}

// ── dashboard ─────────────────────────────────────────────────────────────────

function Dashboard() {
  const [puzzles, setPuzzles] = useState<PuzzleRow[]>([])
  const [listLoading, setListLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [editTarget, setEditTarget] = useState<PuzzleRow | null>(null)
  const formTopRef = useRef<HTMLDivElement>(null)

  async function reload() {
    setListLoading(true)
    const { data } = await supabase
      .from('puzzles')
      .select('id, brand, brand_aliases, year, category, still_urls, video_url')
      .order('sort_order', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: true })
    setPuzzles((data as PuzzleRow[]) ?? [])
    setListLoading(false)
  }

  useEffect(() => {
    reload()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function startEdit(p: PuzzleRow) {
    setEditTarget(p)
    formTopRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  function handleSaved() {
    setEditTarget(null)
    reload()
  }

  function handleCancelEdit() {
    setEditTarget(null)
  }

  async function confirmDelete(id: string) {
    setDeleteLoading(true)
    await supabase.from('puzzles').delete().eq('id', id)
    setDeleteTarget(null)
    setDeleteLoading(false)
    if (editTarget?.id === id) setEditTarget(null)
    reload()
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Adle Admin</h1>
        <button
          onClick={() => supabase.auth.signOut()}
          className="text-xs text-gray-600 hover:text-gray-300 transition-colors"
        >
          Sign out
        </button>
      </div>

      {/* Scroll anchor at the top of the form */}
      <div ref={formTopRef} />

      {/* Create / Edit form */}
      <PuzzleForm
        onSaved={handleSaved}
        editTarget={editTarget}
        onCancelEdit={handleCancelEdit}
      />

      <hr className="border-gray-800" />

      {/* Puzzle list */}
      <section>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
          All puzzles ({puzzles.length})
        </h2>
        {listLoading ? (
          <p className="text-gray-700 text-sm">Loading…</p>
        ) : puzzles.length === 0 ? (
          <p className="text-gray-700 text-sm">No puzzles yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {puzzles.map((p, i) => (
              <div
                key={p.id}
                className={`flex items-center gap-3 bg-gray-900 border rounded-xl p-3 transition-colors ${
                  editTarget?.id === p.id ? 'border-amber-700/60' : 'border-gray-800'
                }`}
              >
                <div className="w-16 h-10 rounded-lg bg-gray-800 overflow-hidden shrink-0">
                  {p.still_urls?.[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.still_urls[0]} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {p.brand}{' '}
                    <span className="text-gray-600 font-normal">({p.year})</span>
                  </p>
                  <p className="text-xs text-gray-600">{p.category}</p>
                </div>
                <span className="text-xs text-gray-700 tabular-nums shrink-0">#{i + 1}</span>
                <button
                  onClick={() => startEdit(p)}
                  className="text-xs text-gray-500 hover:text-amber-400 transition-colors shrink-0"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteTarget(p.id)}
                  className="text-xs text-red-900 hover:text-red-500 transition-colors shrink-0"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Delete confirm modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-xs flex flex-col gap-4">
            <div>
              <p className="text-white font-semibold text-sm">Delete this puzzle?</p>
              <p className="text-gray-500 text-xs mt-1">
                Removes the database row. Stills in Storage are not deleted.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleteLoading}
                className="flex-1 border border-gray-700 text-gray-400 hover:text-white text-sm rounded-xl py-2 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete(deleteTarget)}
                disabled={deleteLoading}
                className="flex-1 bg-red-900 hover:bg-red-700 disabled:opacity-50 text-white text-sm rounded-xl py-2 transition-colors"
              >
                {deleteLoading ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── puzzle form (create + edit) ───────────────────────────────────────────────

const BLANK = {
  brand: '',
  aliasInput: '',
  aliases: [] as string[],
  category: '' as PuzzleCategory | '',
  year: '',
  videoUrl: '',
}

interface PuzzleFormProps {
  onSaved: () => void
  editTarget: PuzzleRow | null
  onCancelEdit: () => void
}

function PuzzleForm({ onSaved, editTarget, onCancelEdit }: PuzzleFormProps) {
  const isEdit = editTarget !== null

  const [f, setF] = useState(BLANK)
  const [stills, setStills] = useState<StillItem[]>([])
  const [removedUrls, setRemovedUrls] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const dragFrom = useRef<number | null>(null)
  const [dragOver, setDragOver] = useState<number | null>(null)

  // Pre-fill when entering edit mode; blank when cancelled or after create
  useEffect(() => {
    setRemovedUrls([])
    if (editTarget) {
      setF({
        brand: editTarget.brand,
        aliasInput: '',
        aliases: editTarget.brand_aliases ?? [],
        category: editTarget.category as PuzzleCategory,
        year: String(editTarget.year),
        videoUrl: editTarget.video_url ?? '',
      })
      setStills(
        (editTarget.still_urls ?? []).map((url) => ({
          kind: 'existing' as const,
          id: crypto.randomUUID(),
          url,
        })),
      )
    } else {
      setF(BLANK)
      setStills([])
    }
  }, [editTarget])

  function upd(patch: Partial<typeof BLANK>) {
    setF((prev) => ({ ...prev, ...patch }))
  }

  // ── aliases ────────────────────────────────────────────────────────────────
  function commitAlias() {
    const parts = f.aliasInput.split(',').map((s) => s.trim()).filter(Boolean)
    if (!parts.length) return
    upd({ aliases: [...new Set([...f.aliases, ...parts])], aliasInput: '' })
  }

  // ── stills ─────────────────────────────────────────────────────────────────
  function addFiles(files: FileList) {
    const slots = 5 - stills.length
    const items: StillItem[] = Array.from(files)
      .slice(0, slots)
      .map((file) => ({
        kind: 'new' as const,
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
      }))
    setStills((prev) => [...prev, ...items])
  }

  function removeStill(id: string) {
    const item = stills.find((s) => s.id === id)
    if (!item) return
    if (item.kind === 'new') URL.revokeObjectURL(item.preview)
    if (item.kind === 'existing') setRemovedUrls((r) => [...r, item.url])
    setStills((prev) => prev.filter((s) => s.id !== id))
  }

  // ── drag-to-reorder ────────────────────────────────────────────────────────
  function onDragStart(index: number) {
    dragFrom.current = index
  }

  function onDragOver(e: React.DragEvent, toIndex: number) {
    e.preventDefault()
    const from = dragFrom.current
    if (from === null || from === toIndex) return
    setStills((prev) => {
      const next = [...prev]
      const [item] = next.splice(from, 1)
      next.splice(toIndex, 0, item)
      return next
    })
    dragFrom.current = toIndex
    setDragOver(toIndex)
  }

  function onDragEnd() {
    dragFrom.current = null
    setDragOver(null)
  }

  // ── submit ─────────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    const brand = f.brand.trim()
    if (!brand) return setError('Brand is required')
    if (!f.category) return setError('Category is required')
    const year = parseInt(f.year, 10)
    if (isNaN(year) || year < 1950 || year > 2030) return setError('Year must be 1950–2030')
    if (stills.length === 0) return setError('Add at least one still image')

    setSubmitting(true)
    try {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession()
      console.log('[admin] upload user id:', currentSession?.user?.id ?? null)
      if (!currentSession) {
        throw new Error('Session expired — please sign out and sign in again.')
      }

      // ── determine storage folder for any new uploads ───────────────────────
      const firstExisting = stills.find((s) => s.kind === 'existing')
      const folder =
        firstExisting && firstExisting.kind === 'existing'
          ? folderFromUrl(firstExisting.url)
          : `${slugify(brand)}-${year}-${Date.now()}`

      // ── delete removed existing stills from Storage ────────────────────────
      for (const url of removedUrls) {
        const path = urlToStoragePath(url)
        if (path) await supabase.storage.from('stills').remove([path])
      }

      // ── upload new stills + build final ordered still_urls ─────────────────
      const stillUrls: string[] = []
      let newIdx = 0
      for (const item of stills) {
        if (item.kind === 'existing') {
          stillUrls.push(item.url)
        } else {
          const blob = await compressImage(item.file)
          const path = `${folder}/new-${Date.now()}-${newIdx++}.jpg`
          const { error: upErr } = await supabase.storage
            .from('stills')
            .upload(path, blob, { contentType: 'image/jpeg', upsert: true })
          if (upErr) throw new Error(`Image upload failed: ${upErr.message}`)
          const { data: urlData } = supabase.storage.from('stills').getPublicUrl(path)
          stillUrls.push(urlData.publicUrl)
        }
      }

      if (isEdit) {
        // ── UPDATE existing row ────────────────────────────────────────────
        const { error: updErr } = await supabase
          .from('puzzles')
          .update({
            brand,
            brand_aliases: f.aliases,
            category: f.category,
            year,
            still_urls: stillUrls,
            video_url: f.videoUrl.trim() || null,
          })
          .eq('id', editTarget.id)
        if (updErr) throw new Error(updErr.message)
        setSuccess(`"${brand}" updated.`)
        onSaved()
      } else {
        // ── INSERT new row ─────────────────────────────────────────────────
        const { data: maxRows } = await supabase
          .from('puzzles')
          .select('sort_order')
          .order('sort_order', { ascending: false })
          .limit(1)
        const nextSort =
          ((maxRows as { sort_order: number }[])?.[0]?.sort_order ?? 0) + 1

        const { error: insErr } = await supabase.from('puzzles').insert({
          brand,
          brand_aliases: f.aliases,
          category: f.category,
          year,
          still_urls: stillUrls,
          video_url: f.videoUrl.trim() || null,
          sort_order: nextSort,
        })
        if (insErr) throw new Error(insErr.message)

        setSuccess(`"${brand}" saved.`)
        stills.forEach((s) => { if (s.kind === 'new') URL.revokeObjectURL(s.preview) })
        setStills([])
        setF(BLANK)
        onSaved()
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section>
      <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-5">
        {isEdit ? `Editing — ${editTarget.brand} (${editTarget.year})` : 'Add puzzle'}
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">

        {/* Brand */}
        <Field label="Brand">
          <input
            type="text"
            value={f.brand}
            onChange={(e) => upd({ brand: e.target.value })}
            placeholder="e.g. Coca-Cola"
            className={inputCls}
          />
        </Field>

        {/* Aliases */}
        <Field label="Brand aliases — press Enter or comma to add">
          <div className="flex gap-2">
            <input
              type="text"
              value={f.aliasInput}
              onChange={(e) => upd({ aliasInput: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ',') {
                  e.preventDefault()
                  commitAlias()
                }
              }}
              placeholder="e.g. Coke"
              className={`${inputCls} flex-1`}
            />
            <button
              type="button"
              onClick={commitAlias}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded-lg transition-colors whitespace-nowrap"
            >
              Add
            </button>
          </div>
          {f.aliases.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {f.aliases.map((a) => (
                <span
                  key={a}
                  className="flex items-center gap-1 bg-gray-700 rounded-full px-2.5 py-1 text-xs text-gray-300"
                >
                  {a}
                  <button
                    type="button"
                    onClick={() => upd({ aliases: f.aliases.filter((x) => x !== a) })}
                    className="text-gray-500 hover:text-white leading-none ml-0.5"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </Field>

        {/* Category + Year */}
        <div className="grid grid-cols-2 gap-3">
          <Field label="Category">
            <select
              value={f.category}
              onChange={(e) => upd({ category: e.target.value as PuzzleCategory })}
              className={`${inputCls} cursor-pointer`}
            >
              <option value="">— pick one —</option>
              {PUZZLE_CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-gray-900">
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Year">
            <input
              type="number"
              value={f.year}
              onChange={(e) => upd({ year: e.target.value })}
              placeholder="e.g. 1995"
              min={1950}
              max={2030}
              className={`${inputCls} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
            />
          </Field>
        </div>

        {/* Video URL */}
        <Field label="Video URL (optional)">
          <input
            type="text"
            value={f.videoUrl}
            onChange={(e) => upd({ videoUrl: e.target.value })}
            placeholder="https://www.youtube.com/watch?v=..."
            className={inputCls}
          />
        </Field>

        {/* Stills */}
        <Field label={`Still images (${stills.length} / 5) — drag to reorder, cryptic → obvious`}>
          {stills.length < 5 && (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files)
              }}
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-gray-700 hover:border-gray-500 rounded-xl px-4 py-7 text-center cursor-pointer transition-colors select-none"
            >
              <p className="text-gray-500 text-sm">Drop images here or click to choose</p>
              <p className="text-gray-700 text-xs mt-1">JPG · PNG · WebP · max 5 frames</p>
              <input
                ref={fileRef}
                type="file"
                multiple
                accept="image/*"
                className="sr-only"
                onChange={(e) => e.target.files && addFiles(e.target.files)}
              />
            </div>
          )}

          {stills.length > 0 && (
            <div className="grid grid-cols-5 gap-2 mt-3">
              {stills.map((still, i) => {
                const src = still.kind === 'existing' ? still.url : still.preview
                return (
                  <div
                    key={still.id}
                    draggable
                    onDragStart={() => onDragStart(i)}
                    onDragOver={(e) => onDragOver(e, i)}
                    onDragEnd={onDragEnd}
                    className={`relative aspect-video rounded-lg overflow-hidden cursor-grab active:cursor-grabbing ring-2 transition-all ${
                      dragOver === i ? 'ring-amber-500' : 'ring-transparent'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <span className="absolute top-1 left-1 bg-black/60 rounded text-[10px] text-white w-4 h-4 flex items-center justify-center font-mono leading-none select-none">
                      {i + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeStill(still.id)}
                      className="absolute top-1 right-1 bg-black/60 hover:bg-red-800 rounded text-white text-[10px] w-4 h-4 flex items-center justify-center leading-none transition-colors"
                    >
                      ×
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </Field>

        {error && <p className="text-red-400 text-sm">{error}</p>}
        {success && <p className="text-green-400 text-sm">{success}</p>}

        <div className="flex gap-3">
          {isEdit && (
            <button
              type="button"
              onClick={onCancelEdit}
              disabled={submitting}
              className="flex-1 border border-gray-700 text-gray-400 hover:text-white disabled:opacity-40 text-sm rounded-xl py-2.5 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={submitting}
            className={`${isEdit ? 'flex-1' : 'w-full'} bg-amber-500 hover:bg-amber-400 active:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed text-black font-semibold text-sm rounded-xl py-2.5 transition-colors`}
          >
            {submitting ? 'Saving…' : isEdit ? 'Update puzzle' : 'Save puzzle'}
          </button>
        </div>
      </form>
    </section>
  )
}

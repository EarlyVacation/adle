function extractYouTubeId(url: string): string | null {
  // Handles: youtube.com/watch?v=ID, youtu.be/ID, /shorts/ID, plus extra params
  const patterns = [
    /[?&]v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /\/shorts\/([a-zA-Z0-9_-]{11})/,
    /\/embed\/([a-zA-Z0-9_-]{11})/,
  ]
  for (const re of patterns) {
    const m = url.match(re)
    if (m) return m[1]
  }
  return null
}

export default function PayoffVideo({ url }: { url: string }) {
  const ytId = extractYouTubeId(url)

  if (ytId) {
    return (
      <div className="w-full aspect-video rounded-xl overflow-hidden mt-3">
        <iframe
          src={`https://www.youtube.com/embed/${ytId}`}
          title="Full commercial"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0"
        />
      </div>
    )
  }

  return (
    <video
      src={url}
      controls
      className="w-full rounded-xl mt-3"
    />
  )
}

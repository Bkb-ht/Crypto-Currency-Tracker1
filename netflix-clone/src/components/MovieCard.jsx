import React from 'react'
import { Plus, Check } from 'lucide-react'
import { useWatchlist } from '../contexts/WatchlistContext'

function posterBg(movie) {
  const seed = (movie?.id || 'x').split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const hue = seed % 360
  return {
    backgroundImage: `linear-gradient(135deg, hsl(${hue} 70% 25%), hsl(${(hue + 40) % 360} 70% 18%))`
  }
}

export default function MovieCard({ movie, onOpen }) {
  const { has, toggle } = useWatchlist()
  const inList = has(movie.id)

  return (
    <div className="group relative">
      <button
        type="button"
        onClick={() => onOpen(movie)}
        className="aspect-[16/9] w-64 overflow-hidden rounded-md bg-white/5 shadow-glow ring-1 ring-white/10 transition-transform duration-200 hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-netflix-red"
        style={posterBg(movie)}
        aria-label={`Open ${movie.title}`}
      >
        <div className="flex h-full w-full flex-col justify-end p-3">
          <div className="text-sm font-semibold">{movie.title}</div>
          <div className="text-xs text-white/70">
            {movie.year} • {movie.maturity} • {movie.duration}
          </div>
        </div>
      </button>

      <button
        type="button"
        onClick={() => toggle(movie.id)}
        className="absolute right-2 top-2 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white/90 opacity-0 backdrop-blur transition group-hover:opacity-100"
        aria-label={inList ? 'Remove from My List' : 'Add to My List'}
        title={inList ? 'Remove from My List' : 'Add to My List'}
      >
        {inList ? <Check size={18} /> : <Plus size={18} />}
      </button>
    </div>
  )
}

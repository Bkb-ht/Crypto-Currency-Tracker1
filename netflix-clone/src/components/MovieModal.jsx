import React from 'react'
import { X, Play, Plus, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useWatchlist } from '../contexts/WatchlistContext'

export default function MovieModal({ movie, onClose }) {
  const navigate = useNavigate()
  const { has, toggle } = useWatchlist()

  if (!movie) return null

  const inList = has(movie.id)

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm md:items-center">
      <div className="w-full max-w-3xl overflow-hidden rounded-xl border border-white/10 bg-netflix-black shadow-glow">
        <div className={`relative h-56 bg-gradient-to-tr ${movie.backdropGradient} md:h-72`}>
          <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-netflix-black/30 to-transparent" />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          <div className="absolute bottom-4 left-4 right-4">
            <div className="text-2xl font-extrabold tracking-tight">{movie.title}</div>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-white/80">
              <span className="chip">{movie.year}</span>
              <span className="chip">{movie.maturity}</span>
              <span className="chip">{movie.duration}</span>
              <span className="chip">⭐ {movie.rating}</span>
              {movie.genres?.slice(0, 3)?.map((g) => (
                <span key={g} className="chip">
                  {g}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="p-5">
          <p className="text-sm leading-relaxed text-white/80">{movie.description}</p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              className="btn-red"
              type="button"
              onClick={() => {
                onClose()
                navigate(`/watch/${movie.id}`)
              }}
            >
              <Play size={18} />
              Play
            </button>

            <button className="btn-ghost" type="button" onClick={() => toggle(movie.id)}>
              {inList ? <Check size={18} /> : <Plus size={18} />}
              {inList ? 'In My List' : 'Add to My List'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

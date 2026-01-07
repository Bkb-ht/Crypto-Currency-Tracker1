import React, { useMemo, useState } from 'react'
import { allMovies } from '../data/mockMovies'
import MovieCard from '../components/MovieCard'
import MovieModal from '../components/MovieModal'
import { useWatchlist } from '../contexts/WatchlistContext'

export default function MyList() {
  const { ids, clear } = useWatchlist()
  const [openMovie, setOpenMovie] = useState(null)

  const movies = useMemo(() => {
    const map = new Map(allMovies.map((m) => [m.id, m]))
    return ids.map((id) => map.get(id)).filter(Boolean)
  }, [ids])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">My List</h1>
          <p className="mt-1 text-sm text-white/70">Saved titles (LocalStorage).</p>
        </div>
        <button className="btn-ghost" type="button" onClick={() => clear()} disabled={ids.length === 0}>
          Clear
        </button>
      </div>

      {movies.length === 0 ? (
        <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
          Your list is empty. Add a title from Home or Search.
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {movies.map((m) => (
            <MovieCard key={m.id} movie={m} onOpen={setOpenMovie} />
          ))}
        </div>
      )}

      <MovieModal movie={openMovie} onClose={() => setOpenMovie(null)} />
    </div>
  )
}

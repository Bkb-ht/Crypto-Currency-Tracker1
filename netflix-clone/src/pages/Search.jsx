import React, { useMemo, useState } from 'react'
import { allMovies } from '../data/mockMovies'
import MovieCard from '../components/MovieCard'
import MovieModal from '../components/MovieModal'

export default function Search() {
  const [q, setQ] = useState('')
  const [openMovie, setOpenMovie] = useState(null)

  const results = useMemo(() => {
    const query = q.trim().toLowerCase()
    if (!query) return allMovies
    return allMovies.filter((m) => {
      return (
        m.title.toLowerCase().includes(query) ||
        (m.genres || []).join(' ').toLowerCase().includes(query)
      )
    })
  }, [q])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-extrabold tracking-tight">Search</h1>
      <p className="mt-1 text-sm text-white/70">Search by title or genre (mock).</p>

      <div className="mt-5">
        <input
          className="input"
          placeholder="Search titles, genres..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((m) => (
          <MovieCard key={m.id} movie={m} onOpen={setOpenMovie} />
        ))}
      </div>

      <MovieModal movie={openMovie} onClose={() => setOpenMovie(null)} />
    </div>
  )
}

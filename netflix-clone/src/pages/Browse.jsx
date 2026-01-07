import React, { useMemo, useState } from 'react'
import { categories } from '../data/mockMovies'
import Row from '../components/Row'
import MovieModal from '../components/MovieModal'

export default function Browse() {
  const [openMovie, setOpenMovie] = useState(null)

  const featured = useMemo(() => {
    const first = categories?.[0]?.items?.[0]
    return first || null
  }, [])

  return (
    <div>
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-netflix-black/60 to-netflix-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(229,9,20,0.25),transparent_45%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
              Featured
              <span className="h-1 w-1 rounded-full bg-white/40" />
              Mock data
            </div>

            <h1 className="mt-5 text-4xl font-extrabold tracking-tight md:text-5xl">
              {featured?.title || 'Featured Title'}
            </h1>

            <p className="mt-4 text-sm leading-relaxed text-white/75 md:text-base">
              {featured?.description ||
                'A Netflix-like UI built with React + Tailwind. Replace mock data with TMDB later.'}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button className="btn-red" type="button" onClick={() => setOpenMovie(featured)}>
                Play
              </button>
              <button className="btn-ghost" type="button" onClick={() => setOpenMovie(featured)}>
                More Info
              </button>
            </div>
          </div>
        </div>
      </section>

      {categories.map((c) => (
        <Row key={c.id} title={c.title} items={c.items} onOpen={setOpenMovie} />
      ))}

      <div className="h-12" />

      <MovieModal movie={openMovie} onClose={() => setOpenMovie(null)} />
    </div>
  )
}

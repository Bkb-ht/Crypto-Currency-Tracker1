import React from 'react'
import MovieCard from './MovieCard'

export default function Row({ title, items, onOpen }) {
  return (
    <section className="mt-8">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-lg font-semibold tracking-tight text-white">{title}</h2>
      </div>

      <div className="mt-3 overflow-x-auto">
        <div className="mx-auto flex max-w-7xl gap-3 px-4 pb-2">
          {items.map((m) => (
            <MovieCard key={m.id} movie={m} onOpen={onOpen} />
          ))}
        </div>
      </div>
    </section>
  )
}

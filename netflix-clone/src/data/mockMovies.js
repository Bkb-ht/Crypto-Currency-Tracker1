const mk = (id, overrides = {}) => ({
  id,
  title: `Movie ${id}`,
  year: 2024,
  maturity: 'U/A 16+',
  duration: '2h 08m',
  genres: ['Action', 'Drama'],
  rating: 8.2,
  description:
    'A high-stakes story of ambition, loyalty, and survival. This is mock data you can replace with TMDB later.',
  backdropGradient:
    'from-zinc-950 via-zinc-950/60 to-transparent',
  accent: 'bg-white/10',
  ...overrides
})

export const categories = [
  {
    id: 'trending',
    title: 'Trending Now',
    items: [
      mk('t1', { title: 'Black Horizon', genres: ['Thriller', 'Mystery'], rating: 8.7 }),
      mk('t2', { title: 'Neon City', genres: ['Action', 'Sci‑Fi'], rating: 8.1 }),
      mk('t3', { title: 'The Last Signal', genres: ['Drama'], rating: 7.9 }),
      mk('t4', { title: 'Frostline', genres: ['Adventure'], rating: 7.6 }),
      mk('t5', { title: 'Midnight Run', genres: ['Action'], rating: 8.0 }),
      mk('t6', { title: 'Echoes', genres: ['Horror'], rating: 7.4 })
    ]
  },
  {
    id: 'top',
    title: 'Top Rated',
    items: [
      mk('r1', { title: 'Red Dust', rating: 9.1, genres: ['Drama'] }),
      mk('r2', { title: 'Paper Kingdom', rating: 8.9, genres: ['Drama', 'History'] }),
      mk('r3', { title: 'Arc Light', rating: 8.8, genres: ['Sci‑Fi'] }),
      mk('r4', { title: 'Blue Room', rating: 8.6, genres: ['Mystery'] }),
      mk('r5', { title: 'The Long Weekend', rating: 8.5, genres: ['Comedy'] })
    ]
  },
  {
    id: 'new',
    title: 'New Releases',
    items: [
      mk('n1', { title: 'Gold Coast', year: 2025, genres: ['Crime'] }),
      mk('n2', { title: 'Afterglow', year: 2025, genres: ['Romance'] }),
      mk('n3', { title: 'Signal Zero', year: 2025, genres: ['Sci‑Fi', 'Thriller'] }),
      mk('n4', { title: 'Wild Atlas', year: 2025, genres: ['Documentary'] }),
      mk('n5', { title: 'Night Shift', year: 2025, genres: ['Horror'] })
    ]
  },
  {
    id: 'family',
    title: 'Family Picks',
    items: [
      mk('f1', { title: 'Sky Cart', maturity: 'U', genres: ['Family', 'Adventure'] }),
      mk('f2', { title: 'Little Giants', maturity: 'U', genres: ['Family', 'Comedy'] }),
      mk('f3', { title: 'The Marble Forest', maturity: 'U/A 7+', genres: ['Fantasy'] }),
      mk('f4', { title: 'Sunny Days', maturity: 'U', genres: ['Animation'] })
    ]
  }
]

export const allMovies = categories.flatMap((c) => c.items)

export function getMovieById(id) {
  return allMovies.find((m) => m.id === id)
}

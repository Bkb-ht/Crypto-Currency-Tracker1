import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { getMovieById } from '../data/mockMovies'
import VideoPlayer from '../components/VideoPlayer'

export default function Watch() {
  const { id } = useParams()
  const movie = getMovieById(id)

  const sampleVideoSrc = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-4 text-sm">
        <Link to="/" className="text-white/70 hover:text-white">
          ← Back to browse
        </Link>
      </div>

      <VideoPlayer src={sampleVideoSrc} title={movie?.title} />

      <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-5 shadow-glow">
        <div className="text-xl font-bold">{movie?.title || 'Unknown title'}</div>
        <div className="mt-2 text-sm text-white/80">{movie?.description}</div>
        <div className="mt-3 text-xs text-white/60">
          This is a frontend-only Netflix clone. Replace the mock video source with a real streaming URL later.
        </div>
      </div>
    </div>
  )
}

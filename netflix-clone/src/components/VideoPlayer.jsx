import React from 'react'

export default function VideoPlayer({ src, title }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-black shadow-glow">
      <div className="aspect-video w-full">
        <video
          className="h-full w-full"
          controls
          autoPlay
          playsInline
          src={src}
          aria-label={title ? `Playing ${title}` : 'Video player'}
        />
      </div>

      {!src ? (
        <div className="p-4 text-sm text-white/70">
          No video source provided.
        </div>
      ) : null}
    </div>
  )
}

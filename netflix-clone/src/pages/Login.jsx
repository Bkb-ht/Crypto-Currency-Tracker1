import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('demo@netflix.local')

  return (
    <div className="min-h-screen bg-netflix-black">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-netflix-black" />
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="text-2xl font-extrabold tracking-tight text-netflix-red">NETFLIX</div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-xl border border-white/10 bg-white/5 p-6 shadow-glow">
          <h1 className="text-2xl font-bold">Sign In</h1>
          <p className="mt-1 text-sm text-white/70">Mock auth. Any email works.</p>

          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              login({ email })
              navigate('/')
            }}
          >
            <div>
              <label className="mb-1 block text-sm text-white/80">Email</label>
              <input
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                type="email"
                required
              />
            </div>

            <button className="btn-red w-full" type="submit">
              Sign In
            </button>

            <div className="text-xs text-white/60">
              Tip: after login you can add titles to <span className="text-white">My List</span>.
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

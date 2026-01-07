import React from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Search, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

function navClass({ isActive }) {
  return `text-sm transition ${isActive ? 'text-white' : 'text-white/70 hover:text-white'}`
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-gradient-to-b from-black/80 to-black/0 backdrop-blur supports-[backdrop-filter]:bg-black/40">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-4">
          <Link to="/" className="text-xl font-extrabold tracking-tight text-netflix-red">
            NETFLIX
          </Link>

          <nav className="hidden items-center gap-5 md:flex">
            <NavLink to="/" className={navClass} end>
              Home
            </NavLink>
            <NavLink to="/search" className={navClass}>
              Search
            </NavLink>
            <NavLink to="/my-list" className={navClass}>
              My List
            </NavLink>
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <button
              className="btn-ghost hidden md:inline-flex"
              onClick={() => navigate('/search')}
              type="button"
            >
              <Search size={18} />
              Search
            </button>

            <div className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 md:block">
              {user?.email}
            </div>

            <button
              className="btn-ghost"
              type="button"
              onClick={() => {
                logout()
                navigate('/login')
              }}
              aria-label="Logout"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { WatchlistProvider } from './contexts/WatchlistContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Browse from './pages/Browse'
import Search from './pages/Search'
import MyList from './pages/MyList'
import Watch from './pages/Watch'

function AuthedLayout({ children }) {
  return (
    <div className="min-h-screen bg-netflix-black text-white">
      <Navbar />
      {children}
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <WatchlistProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AuthedLayout>
                  <Browse />
                </AuthedLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <AuthedLayout>
                  <Search />
                </AuthedLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-list"
            element={
              <ProtectedRoute>
                <AuthedLayout>
                  <MyList />
                </AuthedLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/watch/:id"
            element={
              <ProtectedRoute>
                <AuthedLayout>
                  <Watch />
                </AuthedLayout>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </WatchlistProvider>
    </AuthProvider>
  )
}

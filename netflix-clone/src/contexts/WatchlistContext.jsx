import React, { createContext, useContext, useMemo, useState } from 'react'
import { readJSON, writeJSON } from '../lib/storage'

const WatchlistContext = createContext(null)

const LS_KEY = 'nf_watchlist'

export function WatchlistProvider({ children }) {
  const [ids, setIds] = useState(() => readJSON(LS_KEY, []))

  const value = useMemo(() => {
    const setAndPersist = (next) => {
      setIds(next)
      writeJSON(LS_KEY, next)
    }

    return {
      ids,
      has: (id) => ids.includes(id),
      add: (id) => {
        if (ids.includes(id)) return
        setAndPersist([id, ...ids])
      },
      remove: (id) => {
        if (!ids.includes(id)) return
        setAndPersist(ids.filter((x) => x !== id))
      },
      toggle: (id) => {
        if (ids.includes(id)) {
          setAndPersist(ids.filter((x) => x !== id))
        } else {
          setAndPersist([id, ...ids])
        }
      },
      clear: () => setAndPersist([])
    }
  }, [ids])

  return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>
}

export function useWatchlist() {
  const ctx = useContext(WatchlistContext)
  if (!ctx) throw new Error('useWatchlist must be used inside WatchlistProvider')
  return ctx
}

import { useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'markitdown-history'
const MAX_ITEMS = 20

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function saveHistory(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function useHistory() {
  const [items, setItems] = useState(loadHistory)

  // Sync with localStorage changes from other tabs
  useEffect(() => {
    const handler = (e) => {
      if (e.key === STORAGE_KEY) {
        setItems(loadHistory())
      }
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])

  const addItem = useCallback((entry) => {
    // Check settings for history saving
    try {
      const settings = JSON.parse(localStorage.getItem('markitdown-settings') || '{}')
      if (settings.saveHistory === false) return
    } catch { /* proceed */ }

    setItems((prev) => {
      const newItem = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        timestamp: new Date().toISOString(),
        ...entry,
      }
      const updated = [newItem, ...prev].slice(0, MAX_ITEMS)
      saveHistory(updated)
      return updated
    })
  }, [])

  const clearHistory = useCallback(() => {
    setItems([])
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const removeItem = useCallback((id) => {
    setItems((prev) => {
      const updated = prev.filter((item) => item.id !== id)
      saveHistory(updated)
      return updated
    })
  }, [])

  return { items, addItem, clearHistory, removeItem }
}

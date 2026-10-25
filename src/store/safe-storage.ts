import type { StateStorage } from 'zustand/middleware'

/**
 * SSR-safe, corruption-resilient localStorage adapter for Zustand.
 * If reading or parsing fails, corrupted data is purged and null is returned,
 * prompting Zustand to initialize cleanly from default state.
 */
export const safeLocalStorage: StateStorage = {
  getItem: (name: string): string | null => {
    if (typeof window === 'undefined') return null
    try {
      const raw = window.localStorage.getItem(name)
      if (raw === null || raw === '') return null
      // Quick sanity check on JSON structure
      JSON.parse(raw)
      return raw
    } catch {
      // Corrupted storage detected: purge key to recover
      try {
        window.localStorage.removeItem(name)
      } catch {
        // Ignore removal errors
      }
      return null
    }
  },
  setItem: (name: string, value: string): void => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(name, value)
    } catch {
      // Ignore quota exceeded or privacy sandbox errors
    }
  },
  removeItem: (name: string): void => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.removeItem(name)
    } catch {
      // Ignore
    }
  },
}

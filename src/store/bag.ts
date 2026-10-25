import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { safeLocalStorage } from './safe-storage'

export interface BagLine {
  productId: string
  qty: number
}

export interface BagState {
  lines: BagLine[]
  add: (productId: string, qty?: number) => void
  setQty: (productId: string, qty: number) => void
  remove: (productId: string) => void
  clear: () => void
  addMany: (items: Array<{ productId: string; qty: number }>) => void
  count: () => number
}

export const useBag = create<BagState>()(
  persist(
    (set, get) => ({
      lines: [],

      add: (productId: string, qty = 1) => {
        const cleanQty = Math.max(1, Math.min(9, Math.round(qty)))
        set((state) => {
          const existing = state.lines.find((l) => l.productId === productId)
          if (existing) {
            const nextQty = Math.min(9, existing.qty + cleanQty)
            return {
              lines: state.lines.map((l) =>
                l.productId === productId ? { ...l, qty: nextQty } : l,
              ),
            }
          }
          return {
            lines: [...state.lines, { productId, qty: cleanQty }],
          }
        })
      },

      setQty: (productId: string, qty: number) => {
        set((state) => {
          if (qty <= 0) {
            return {
              lines: state.lines.filter((l) => l.productId !== productId),
            }
          }
          const cleanQty = Math.min(9, Math.max(1, Math.round(qty)))
          return {
            lines: state.lines.map((l) =>
              l.productId === productId ? { ...l, qty: cleanQty } : l,
            ),
          }
        })
      },

      remove: (productId: string) => {
        set((state) => ({
          lines: state.lines.filter((l) => l.productId !== productId),
        }))
      },

      clear: () => {
        set({ lines: [] })
      },

      addMany: (items: Array<{ productId: string; qty: number }>) => {
        if (!items.length) return
        set((state) => {
          const map = new Map<string, number>()
          for (const line of state.lines) {
            map.set(line.productId, line.qty)
          }
          for (const item of items) {
            const cur = map.get(item.productId) ?? 0
            const add = Math.max(1, Math.round(item.qty))
            map.set(item.productId, Math.min(9, cur + add))
          }
          return {
            lines: Array.from(map.entries()).map(([productId, qty]) => ({
              productId,
              qty,
            })),
          }
        })
      },

      count: () => {
        return get().lines.reduce((total, line) => total + line.qty, 0)
      },
    }),
    {
      name: 'neko-delice-bag-v1',
      storage: createJSONStorage(() => safeLocalStorage),
      partialize: (state) => ({ lines: state.lines }),
    },
  ),
)

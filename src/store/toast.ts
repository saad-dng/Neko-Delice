import { create } from 'zustand'

export interface ToastItem {
  id: string
  message: string
  undoAction?: () => void
  durationMs?: number
}

export interface ToastState {
  current: ToastItem | null
  showToast: (item: Omit<ToastItem, 'id'>) => void
  hideToast: () => void
}

let toastCounter = 0

export const useToast = create<ToastState>((set) => ({
  current: null,

  showToast: (item) => {
    toastCounter += 1
    const id = `toast-${toastCounter}`
    set({
      current: {
        ...item,
        id,
        durationMs: item.durationMs ?? 5000,
      },
    })
  },

  hideToast: () => {
    set({ current: null })
  },
}))

export default useToast

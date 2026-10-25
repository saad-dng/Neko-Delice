import { create } from 'zustand'

export interface BagUiState {
  isOpen: boolean
  triggerElement: HTMLElement | null
  openBag: (trigger?: HTMLElement | null) => void
  closeBag: () => void
}

export const useBagUi = create<BagUiState>((set) => ({
  isOpen: false,
  triggerElement: null,

  openBag: (trigger = null) => {
    const activeEl =
      trigger ??
      (typeof document !== 'undefined'
        ? (document.activeElement as HTMLElement | null)
        : null)
    set({ isOpen: true, triggerElement: activeEl })
  },

  closeBag: () => {
    set({ isOpen: false })
  },
}))

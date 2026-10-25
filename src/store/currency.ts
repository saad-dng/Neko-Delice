import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Currency } from '@/data/types'
import { safeLocalStorage } from './safe-storage'

export interface CurrencyState {
  currency: Currency
  setCurrency: (currency: Currency) => void
  toggleCurrency: () => void
}

export const useCurrency = create<CurrencyState>()(
  persist(
    (set) => ({
      currency: 'USD',

      setCurrency: (currency: Currency) => {
        if (currency === 'USD' || currency === 'BDT') {
          set({ currency })
        }
      },

      toggleCurrency: () => {
        set((state) => ({
          currency: state.currency === 'USD' ? 'BDT' : 'USD',
        }))
      },
    }),
    {
      name: 'neko-delice-currency-v1',
      storage: createJSONStorage(() => safeLocalStorage),
      partialize: (state) => ({ currency: state.currency }),
    },
  ),
)

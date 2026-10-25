import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { CatProfile } from '@/data/types'
import { safeLocalStorage } from './safe-storage'

export interface PlannerProfileState {
  profile: CatProfile | null
  setProfile: (profile: CatProfile) => void
  clearProfile: () => void
}

export const usePlannerProfile = create<PlannerProfileState>()(
  persist(
    (set) => ({
      profile: null,

      setProfile: (profile: CatProfile) => {
        set({ profile })
      },

      clearProfile: () => {
        set({ profile: null })
      },
    }),
    {
      name: 'neko-delice-planner-v1',
      storage: createJSONStorage(() => safeLocalStorage),
      partialize: (state) => ({ profile: state.profile }),
    },
  ),
)

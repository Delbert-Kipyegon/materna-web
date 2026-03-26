'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AppState, Language, PregnancyData } from '../types'

interface AppStore extends AppState {
  setLanguage: (language: Language) => void
  setPregnancyData: (data: Partial<PregnancyData>) => void
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      language: 'en',
      pregnancyData: {
        dueDate: null,
        currentWeek: 0,
        babySize: '',
        milestone: '',
      },

      setLanguage: (language) => set({ language }),

      setPregnancyData: (data) =>
        set((state) => ({
          pregnancyData: { ...state.pregnancyData, ...data },
        })),
    }),
    {
      name: 'materna-ai-storage',
      partialize: (state) => ({
        language: state.language,
        pregnancyData: state.pregnancyData,
      }),
      storage: {
        getItem: (name) => {
          if (typeof window === 'undefined') return null
          const str = localStorage.getItem(name)
          if (!str) return null
          const parsed = JSON.parse(str)
          if (parsed.state?.pregnancyData?.dueDate) {
            parsed.state.pregnancyData.dueDate = new Date(parsed.state.pregnancyData.dueDate)
          }
          return parsed
        },
        setItem: (name, value) => {
          if (typeof window === 'undefined') return
          const toStore = {
            ...value,
            state: {
              ...value.state,
              pregnancyData: {
                ...value.state.pregnancyData,
                dueDate: value.state.pregnancyData.dueDate
                  ? value.state.pregnancyData.dueDate.toISOString()
                  : null,
              },
            },
          }
          localStorage.setItem(name, JSON.stringify(toStore))
        },
        removeItem: (name) => {
          if (typeof window === 'undefined') return
          localStorage.removeItem(name)
        },
      },
    }
  )
)

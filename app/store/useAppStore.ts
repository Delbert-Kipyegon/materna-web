'use client'

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, Language, Note, PregnancyData } from '../types';

interface AppStore extends AppState {
  setLanguage: (language: Language) => void;
  setPregnancyData: (data: Partial<PregnancyData>) => void;
  addNote: (note: Omit<Note, 'id' | 'createdAt'>) => void;
  removeNote: (id: string) => void;
  togglePinNote: (id: string) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      language: 'en',
      isPrime: true, // Always true during beta
      pregnancyData: {
        dueDate: null,
        currentWeek: 0,
        babySize: '',
        milestone: ''
      },
      savedNotes: [],
      
      setLanguage: (language) => set({ language }),
      
      setPregnancyData: (data) => set((state) => ({
        pregnancyData: { ...state.pregnancyData, ...data }
      })),
      
      addNote: (noteData) => set((state) => ({
        savedNotes: [
          {
            ...noteData,
            id: Date.now().toString(),
            createdAt: new Date()
          },
          ...state.savedNotes
        ]
      })),
      
      removeNote: (id) => set((state) => ({
        savedNotes: state.savedNotes.filter(note => note.id !== id)
      })),
      
      togglePinNote: (id) => set((state) => ({
        savedNotes: state.savedNotes.map(note =>
          note.id === id ? { ...note, isPinned: !note.isPinned } : note
        )
      }))
    }),
    {
      name: 'materna-ai-storage',
      storage: {
        getItem: (name) => {
          if (typeof window === 'undefined') return null;
          
          const str = localStorage.getItem(name);
          if (!str) return null;
          
          const parsed = JSON.parse(str);
          
          // Transform stored data back to proper types
          if (parsed.state) {
            // Convert dueDate string back to Date object
            if (parsed.state.pregnancyData?.dueDate) {
              parsed.state.pregnancyData.dueDate = new Date(parsed.state.pregnancyData.dueDate);
            }
            
            // Convert createdAt strings back to Date objects in savedNotes
            if (parsed.state.savedNotes) {
              parsed.state.savedNotes = parsed.state.savedNotes.map((note: any) => ({
                ...note,
                createdAt: new Date(note.createdAt)
              }));
            }
          }
          
          return parsed;
        },
        setItem: (name, value) => {
          if (typeof window === 'undefined') return;
          
          const toStore = {
            ...value,
            state: {
              ...value.state,
              pregnancyData: {
                ...value.state.pregnancyData,
                // Convert Date object to string for storage
                dueDate: value.state.pregnancyData.dueDate 
                  ? value.state.pregnancyData.dueDate.toISOString() 
                  : null
              },
              savedNotes: value.state.savedNotes.map((note: Note) => ({
                ...note,
                // Convert Date object to string for storage
                createdAt: note.createdAt.toISOString()
              }))
            }
          };
          
          localStorage.setItem(name, JSON.stringify(toStore));
        },
        removeItem: (name) => {
          if (typeof window === 'undefined') return;
          localStorage.removeItem(name);
        }
      }
    }
  )
);
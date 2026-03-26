export interface PregnancyData {
  dueDate: Date | null
  currentWeek: number
  babySize: string
  milestone: string
}

export type Language = 'en' | 'sw'

export interface AppState {
  language: Language
  pregnancyData: PregnancyData
}

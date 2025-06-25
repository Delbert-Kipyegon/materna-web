export interface Note {
  id: string;
  content: string;
  type: 'tip' | 'affirmation' | 'milestone' | 'custom';
  createdAt: Date;
  isPinned?: boolean;
}

export interface PregnancyData {
  dueDate: Date | null;
  currentWeek: number;
  babySize: string;
  milestone: string;
}

export interface DailyTip {
  id: string;
  title: string;
  content: string;
  category: 'nutrition' | 'wellness' | 'preparation' | 'health';
  isPrime: boolean;
}

export interface Affirmation {
  id: string;
  text: string;
  category: 'confidence' | 'strength' | 'love' | 'peace';
}

export type Language = 'en' | 'sw';

export interface AppState {
  language: Language;
  isPrime: boolean;
  pregnancyData: PregnancyData;
  savedNotes: Note[];
}
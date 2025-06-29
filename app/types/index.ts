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
  _id?: string;
  id?: string;
  text: string;
  category: 'confidence' | 'strength' | 'love' | 'peace';
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SpeechSettings {
  stability: number;
  similarityBoost: number;
  style: number;
  useSpeakerBoost: boolean;
}

export type Language = 'en' | 'sw';

export interface AppState {
  language: Language;
  isPrime: boolean;
  pregnancyData: PregnancyData;
  savedNotes: Note[];
}
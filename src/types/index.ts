export type SectionType = "schwerpunkte" | "begriffe" | "beispiele" | "fragen" | "fazit";

export interface Section {
  id: string;
  type: SectionType;
  title: string;
  content: string;
  isEditing?: boolean;
}

export interface PDFFile {
  id: string;
  name: string;
  uploadDate: string;
  url: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  addedBy: string;
  sections: Section[];
  pdfs: PDFFile[];
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  status: "new" | "known" | "unknown";
}

export interface Deck {
  id: string;
  title: string;
  cardCount: number;
  progress: number;
  cards: Flashcard[];
}

export type QuizDifficulty = "Grundlagen" | "Vertiefung" | "Prüfungsvorbereitung";
export type QuestionType = "multiple_choice" | "single_choice" | "short_answer";

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  type: QuestionType;
  question: string;
  options?: string[]; // For MC/SC
  correct_answer?: any; // indices array for MC/SC, string for short_answer
  feedback: string;
  order: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  module_id?: string;
  difficulty: QuizDifficulty;
  time_limit_seconds?: number; // null/0 = no limit
  user_id: string;
  questions?: QuizQuestion[];
  question_count?: number; // computed
}

export interface QuizAttempt {
  id: string;
  quiz_id: string;
  user_id: string;
  score: number;
  max_score: number;
  status: "in_progress" | "completed";
  completed_at?: string;
}

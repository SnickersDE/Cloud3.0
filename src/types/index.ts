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

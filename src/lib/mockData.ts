import { Module, Deck } from "@/types";

export const MOCK_MODULES: Module[] = [
  {
    id: "1",
    title: "Einführung in die Berufspädagogik",
    description: "Grundlagen, Geschichte und theoretische Konzepte der Berufspädagogik.",
    addedBy: "Prof. Müller",
    sections: [
      {
        id: "s1",
        type: "schwerpunkte",
        title: "Inhaltliche Schwerpunkte",
        content: "- Historische Entwicklung der Berufsbildung\n- Duales System in Deutschland\n- Lernortkooperation",
      },
      {
        id: "s2",
        type: "begriffe",
        title: "Schlüsselbegriffe",
        content: "Berufliche Handlungsfähigkeit, Kompetenzorientierung, Lernfeldkonzept",
      },
      {
        id: "s3",
        type: "beispiele",
        title: "Beispiele",
        content: "Vergleich Duales System vs. Schulische Ausbildung",
      },
      {
        id: "s4",
        type: "fragen",
        title: "Fragen",
        content: "1. Was sind die Vor- und Nachteile des Dualen Systems?\n2. Wie hat sich die Rolle des Ausbilders gewandelt?",
      },
      {
        id: "s5",
        type: "fazit",
        title: "Fazit",
        content: "Die Berufspädagogik ist eine essentielle Disziplin für die Gestaltung moderner Bildungssysteme.",
      },
    ],
    pdfs: [
      {
        id: "p1",
        name: "Vorlesung_1_Grundlagen.pdf",
        uploadDate: "2023-10-01",
        url: "#",
      },
    ],
  },
  {
    id: "2",
    title: "Didaktik der beruflichen Bildung",
    description: "Methoden und Modelle für den Unterricht in beruflichen Schulen.",
    addedBy: "Dr. Schmidt",
    sections: [
      {
        id: "s1",
        type: "schwerpunkte",
        title: "Inhaltliche Schwerpunkte",
        content: "- Handlungsorientierter Unterricht\n- Makro- und Mikromethoden\n- Medieneinsatz",
      },
      {
        id: "s2",
        type: "begriffe",
        title: "Schlüsselbegriffe",
        content: "Vollständige Handlung, Projektmethode, Leittextmethode",
      },
    ],
    pdfs: [],
  },
];

export const MOCK_DECKS: Deck[] = [
  {
    id: "d1",
    title: "Rechtliche Grundlagen",
    cardCount: 15,
    progress: 45,
    cards: [
      { id: "c1", front: "BBiG", back: "Berufsbildungsgesetz", status: "known" },
      { id: "c2", front: "JArbSchG", back: "Jugendarbeitsschutzgesetz", status: "unknown" },
      { id: "c3", front: "Ausbildungsordnung", back: "Rechtsverbindliche Grundlage für die betriebliche Ausbildung", status: "new" },
    ],
  },
  {
    id: "d2",
    title: "Lernpsychologie",
    cardCount: 24,
    progress: 10,
    cards: [
      { id: "c1", front: "Kognitivismus", back: "Lernen als Informationsverarbeitungsprozess", status: "known" },
    ],
  },
];

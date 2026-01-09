# Berufspädagogik Plattform Frontend

Das Frontend für die cloudbasierte Studentenplattform "Berufspädagogik".
Entwickelt mit Next.js, Tailwind CSS und Framer Motion.

## Features

### 1. Zusammenfassungen (/summaries)
- Globale Suche über alle Module.
- Detailansicht mit strukturierten Inhalten (Schwerpunkte, Begriffe, etc.).
- Bearbeitungsmodus (Toggle per Zahnrad-Icon) für Inhalte.
- PDF Upload/Download UI.

### 2. Karteikarten (/flashcards)
- Deck-Übersicht mit Lernfortschritt.
- Interaktiver Lernmodus mit Flip-Animation (Vorder-/Rückseite).
- Auswertung nach Lerneinheit (Gewusst / Nicht gewusst).

### 3. Design & UI
- Minimalistisches, akademisches Design.
- Responsive Mobile-First Layout.
- Flüssige Animationen und Micro-Interactions.

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS
- **Sprache:** TypeScript
- **Icons:** Lucide React
- **Animation:** Framer Motion

## Installation & Start

1. Abhängigkeiten installieren:
   ```bash
   npm install
   ```

2. Entwicklungsserver starten:
   ```bash
   npm run dev
   ```

3. Öffnen unter [http://localhost:3000](http://localhost:3000).

## Projektstruktur

- `src/app`: Next.js App Router Pages.
- `src/components`: Wiederverwendbare UI-Komponenten.
  - `ui`: Basiskomponenten (Navbar, Buttons).
  - `features`: Feature-spezifische Komponenten (ModuleCard, FlashcardView).
- `src/lib`: Mock Data und Hilfsfunktionen.
- `src/types`: TypeScript Definitionen.

## Backend Integration (Geplant)

Die Anwendung ist für die Integration mit **Supabase** vorbereitet.
- **Auth:** Ersetzen des Mock-Auth-States in `Navbar.tsx` durch Supabase Auth.
- **Datenbank:** Ersetzen von `MOCK_MODULES` und `MOCK_DECKS` durch Supabase Client Queries.
- **Storage:** Implementierung der PDF-Upload Logik in `PDFSection.tsx` mit Supabase Storage.

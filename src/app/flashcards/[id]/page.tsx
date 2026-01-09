"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MOCK_DECKS } from "@/lib/mockData";
import FlashcardView from "@/components/features/FlashcardView";
import { ArrowLeft, CheckCircle, RotateCcw } from "lucide-react";
import Link from "next/link";

export default function LearningSessionPage() {
  const params = useParams();
  const id = params?.id as string;
  const deck = MOCK_DECKS.find((d) => d.id === id);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [results, setResults] = useState<{ known: number; unknown: number }>({ known: 0, unknown: 0 });

  if (!deck) {
    return <div>Deck nicht gefunden</div>;
  }

  const handleResult = (result: "known" | "unknown") => {
    setResults((prev) => ({ ...prev, [result]: prev[result] + 1 }));
    
    if (currentIndex < deck.cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCompleted(true);
    }
  };

  const restart = () => {
    setCurrentIndex(0);
    setCompleted(false);
    setResults({ known: 0, unknown: 0 });
  };

  if (completed) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="mb-8 inline-flex p-6 bg-green-50 rounded-full">
          <CheckCircle className="w-16 h-16 text-primary" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Lerneinheit abgeschlossen!</h1>
        <p className="text-xl text-gray-600 mb-12">
          Du hast alle {deck.cards.length} Karten durchgearbeitet.
        </p>
        
        <div className="grid grid-cols-2 gap-6 mb-12">
          <div className="p-6 bg-green-50 rounded-xl border border-green-100">
            <div className="text-3xl font-bold text-green-600">{results.known}</div>
            <div className="text-gray-600">Gewusst</div>
          </div>
          <div className="p-6 bg-red-50 rounded-xl border border-red-100">
            <div className="text-3xl font-bold text-red-600">{results.unknown}</div>
            <div className="text-gray-600">Nicht gewusst</div>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <Link
            href="/flashcards"
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Zurück zur Übersicht
          </Link>
          <button
            onClick={restart}
            className="flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Nochmal lernen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto min-h-[80vh] flex flex-col">
      <div className="mb-8 flex items-center justify-between">
        <Link
          href="/flashcards"
          className="inline-flex items-center text-gray-500 hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Abbrechen
        </Link>
        <div className="text-sm font-medium text-gray-500">
          Karte {currentIndex + 1} von {deck.cards.length}
        </div>
      </div>

      <div className="flex-grow flex items-center justify-center">
        <FlashcardView 
          card={deck.cards[currentIndex]} 
          onResult={handleResult} 
        />
      </div>
      
      <div className="mt-12 w-full bg-gray-100 h-2 rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${((currentIndex) / deck.cards.length) * 100}%` }}
        />
      </div>
    </div>
  );
}

"use client";

import { MOCK_DECKS } from "@/lib/mockData";
import DeckCard from "@/components/features/DeckCard";
import { Plus } from "lucide-react";

export default function FlashcardsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Karteikarten</h1>
          <p className="text-white mt-1">
            Wähle ein Deck und beginne zu lernen.
          </p>
        </div>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm">
          <Plus className="w-5 h-5" />
          <span>Deck erstellen</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_DECKS.map((deck) => (
          <DeckCard key={deck.id} deck={deck} />
        ))}
      </div>
    </div>
  );
}

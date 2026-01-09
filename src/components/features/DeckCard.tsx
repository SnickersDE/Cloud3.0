import Link from "next/link";
import { Deck } from "@/types";
import { Layers, ArrowRight } from "lucide-react";

interface DeckCardProps {
  deck: Deck;
}

export default function DeckCard({ deck }: DeckCardProps) {
  return (
    <Link href={`/flashcards/${deck.id}`}>
      <div className="group bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors">
            <Layers className="w-6 h-6" />
          </div>
          <span className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
            {deck.cardCount} Karten
          </span>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-primary transition-colors">
          {deck.title}
        </h3>
        
        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <span>Fortschritt</span>
            <span>{deck.progress}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-500"
              style={{ width: `${deck.progress}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}

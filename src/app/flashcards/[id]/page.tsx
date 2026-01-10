"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import FlashcardView from "@/components/features/FlashcardView";
import { ArrowLeft, CheckCircle, RotateCcw, Plus, Loader2, Trash2, Edit3, Save, X } from "lucide-react";
import Link from "next/link";
import { Deck, Flashcard } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

export default function LearningSessionPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const supabase = createClient();

  const [deck, setDeck] = useState<Deck | null>(null);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [results, setResults] = useState<{ known: number; unknown: number }>({ known: 0, unknown: 0 });

  // New Card State
  const [newFront, setNewFront] = useState("");
  const [newBack, setNewBack] = useState("");
  const [isAddingCard, setIsAddingCard] = useState(false);

  const [isEditingDeck, setIsEditingDeck] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");

  const fetchDeckData = useCallback(async () => {
    try {
      // 1. Fetch Deck
      const { data: deckData, error: deckError } = await supabase
        .from("decks")
        .select("*")
        .eq("id", id)
        .single();

      if (deckError) throw deckError;

      // 2. Fetch Cards
      const { data: cardsData, error: cardsError } = await supabase
        .from("flashcards")
        .select("*")
        .eq("deck_id", id);

      if (cardsError) throw cardsError;

      setDeck({
        ...deckData,
        cardCount: cardsData?.length || 0,
        progress: 0,
        cards: cardsData || [],
      });
      setCards(cardsData || []);
      setEditedTitle(deckData.title);
    } catch (err) {
      console.error("Error loading deck:", err);
    } finally {
      setIsLoading(false);
    }
  }, [id, supabase]);

  useEffect(() => {
    if (id) fetchDeckData();
  }, [id, fetchDeckData]);

  const handleResult = (result: "known" | "unknown") => {
    setResults((prev) => ({ ...prev, [result]: prev[result] + 1 }));
    
    if (currentIndex < cards.length - 1) {
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

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingCard(true);

    try {
      const { error } = await supabase
        .from("flashcards")
        .insert({
          deck_id: id,
          front: newFront,
          back: newBack,
          status: "new",
        });

      if (error) throw error;

      setNewFront("");
      setNewBack("");
      fetchDeckData(); // Refresh to show new card
    } catch (err) {
      console.error("Error adding card:", err);
      alert("Fehler beim Hinzufügen der Karte.");
    } finally {
      setIsAddingCard(false);
    }
  };

  const handleDeleteDeck = async () => {
    if (!confirm("Möchtest du dieses Deck wirklich löschen?")) return;
    try {
      const { error } = await supabase.from("decks").delete().eq("id", id);
      if (error) throw error;
      router.push("/flashcards");
    } catch (err) {
      console.error("Error deleting deck:", err);
      alert("Fehler beim Löschen des Decks.");
    }
  };

  const handleUpdateDeck = async () => {
    try {
      const { error } = await supabase
        .from("decks")
        .update({ title: editedTitle })
        .eq("id", id);
      if (error) throw error;
      setDeck(prev => prev ? { ...prev, title: editedTitle } : null);
      setIsEditingDeck(false);
    } catch (err) {
      console.error("Error updating deck:", err);
      alert("Fehler beim Aktualisieren des Decks.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!deck) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-white">Deck nicht gefunden</h2>
        <Link href="/flashcards" className="text-primary hover:underline mt-4 inline-block">
          Zurück zur Übersicht
        </Link>
      </div>
    );
  }

  // View for Empty Deck (Add Cards)
  if (cards.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-10">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/flashcards"
            className="inline-flex items-center text-gray-400 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück zur Übersicht
          </Link>
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditingDeck(true)}
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              Bearbeiten
            </button>
            <span className="text-gray-600">|</span>
            <button
              onClick={handleDeleteDeck}
              className="text-xs text-gray-400 hover:text-red-400 transition-colors"
            >
              Löschen
            </button>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          {isEditingDeck ? (
            <div className="mb-4 flex items-center gap-2">
              <input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-primary"
              />
              <button onClick={handleUpdateDeck} className="p-2 text-green-600 hover:bg-green-50 rounded"><Save className="w-5 h-5" /></button>
              <button onClick={() => setIsEditingDeck(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
            </div>
          ) : (
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{deck.title} ist leer</h2>
          )}
          <p className="text-gray-600 mb-8">Füge die ersten Karteikarten hinzu, um zu starten.</p>
          
          <form onSubmit={handleAddCard} className="space-y-4 text-left">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vorderseite (Frage)</label>
              <input 
                type="text" 
                required
                value={newFront}
                onChange={(e) => setNewFront(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-gray-900"
                placeholder="Was ist Didaktik?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rückseite (Antwort)</label>
              <textarea 
                required
                value={newBack}
                onChange={(e) => setNewBack(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-gray-900"
                placeholder="Die Wissenschaft vom Lehren und Lernen."
                rows={3}
              />
            </div>
            <button 
              type="submit" 
              disabled={isAddingCard}
              className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium flex justify-center items-center"
            >
              {isAddingCard ? <Loader2 className="w-5 h-5 animate-spin" /> : "Karte hinzufügen"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto text-center py-20"
      >
        <div className="mb-8 inline-flex p-6 bg-green-50 rounded-full">
          <CheckCircle className="w-16 h-16 text-primary" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">Lerneinheit abgeschlossen!</h1>
        <p className="text-xl text-gray-300 mb-12">
          Du hast alle {cards.length} Karten durchgearbeitet.
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
            className="px-6 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
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
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto min-h-[80vh] flex flex-col pb-20">
      <div className="mb-8 flex items-center justify-between">
        <Link
          href="/flashcards"
          className="inline-flex items-center text-gray-400 hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Abbrechen
        </Link>
        <div className="text-sm font-medium text-gray-400">
          Karte {currentIndex + 1} von {cards.length}
        </div>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center gap-8">
        <FlashcardView 
          card={cards[currentIndex]} 
          onResult={handleResult}
          onDelete={async () => {
            if (!confirm("Karte wirklich löschen?")) return;
            const currentCard = cards[currentIndex];
            const { error } = await supabase.from("flashcards").delete().eq("id", currentCard.id);
            if (!error) {
               // Update local state
               const newCards = cards.filter(c => c.id !== currentCard.id);
               setCards(newCards);
               
               if (newCards.length === 0) {
                 // Deck is now empty, user asked to delete deck if empty? 
                 // "wenn man jede Karte beispielsweise einzelnt löscht bis keine mehr übrig ist, das Deck aus der Gesamtübersicht verschwindet."
                 // Yes, delete deck.
                 await supabase.from("decks").delete().eq("id", id);
                 router.push("/flashcards");
               } else {
                 // Move to next card or previous if last
                 if (currentIndex >= newCards.length) {
                   setCurrentIndex(newCards.length - 1);
                 }
               }
            }
          }}
        />
        
        {/* Add Card Shortcut for quick editing */}
        <div className="mt-8 pt-8 border-t border-gray-700 w-full max-w-lg">
           <details className="group">
             <summary className="flex cursor-pointer items-center justify-center gap-2 text-gray-400 hover:text-white transition-colors">
               <Plus className="w-4 h-4" />
               <span className="text-sm">Neue Karte hinzufügen</span>
             </summary>
             <form onSubmit={handleAddCard} className="mt-4 space-y-3 bg-white/5 p-4 rounded-lg backdrop-blur-sm border border-white/10">
               <input 
                 className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-primary"
                 placeholder="Vorderseite"
                 value={newFront}
                 onChange={e => setNewFront(e.target.value)}
                 required
               />
               <input 
                 className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-primary"
                 placeholder="Rückseite"
                 value={newBack}
                 onChange={e => setNewBack(e.target.value)}
                 required
               />
               <button 
                 type="submit" 
                 disabled={isAddingCard}
                 className="w-full py-2 bg-primary/20 text-primary hover:bg-primary/30 rounded transition-colors text-sm font-medium"
               >
                 {isAddingCard ? "..." : "Hinzufügen"}
               </button>
             </form>
           </details>

           <div className="flex justify-center gap-4 mt-6 pt-6 border-t border-gray-700/50">
             {isEditingDeck ? (
               <div className="flex items-center gap-2">
                 <input
                   value={editedTitle}
                   onChange={(e) => setEditedTitle(e.target.value)}
                   className="bg-white/10 border border-white/20 rounded px-3 py-1 text-white text-sm"
                 />
                 <button onClick={handleUpdateDeck} className="p-1 text-green-400 hover:text-green-300"><Save className="w-4 h-4" /></button>
                 <button onClick={() => setIsEditingDeck(false)} className="p-1 text-gray-400 hover:text-gray-300"><X className="w-4 h-4" /></button>
               </div>
             ) : (
               <button
                 onClick={() => setIsEditingDeck(true)}
                 className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
               >
                 <Edit3 className="w-4 h-4" />
                 Deck bearbeiten
               </button>
             )}
             
             <button
               onClick={handleDeleteDeck}
               className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition-colors"
             >
               <Trash2 className="w-4 h-4" />
               Deck löschen
             </button>
           </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import DeckCard from "@/components/features/DeckCard";
import { Plus, Loader2, X } from "lucide-react";
import { Deck } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

export default function FlashcardsPage() {
  const supabase = createClient();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Form State
  const [newTitle, setNewTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchDecks();
  }, []);

  const fetchDecks = async () => {
    setIsLoading(true);
    // Fetch Decks with Cards to calculate count/progress
    const { data, error } = await supabase
      .from("decks")
      .select("*, flashcards(*)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching decks:", error);
    } else if (data) {
      const mappedDecks: Deck[] = data.map((d: any) => {
        const cards = d.flashcards || [];
        // Calculate progress (simple example: known / total)
        // In real app, progress might be stored in user_progress table
        const knownCount = cards.filter((c: any) => c.status === 'known').length; // Assuming status is stored on card, but usually it's per user
        // Since we don't have user_card_progress table yet, we assume status is not persisted per user or default to 0
        const progress = cards.length > 0 ? Math.round((knownCount / cards.length) * 100) : 0;

        return {
          id: d.id,
          title: d.title,
          cardCount: cards.length,
          progress: 0, // Mock progress for now as schema is simple
          cards: [], // We don't need cards content here
        };
      });
      setDecks(mappedDecks);
    }
    setIsLoading(false);
  };

  const handleCreateDeck = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Nicht eingeloggt");

      const { error } = await supabase
        .from("decks")
        .insert({
          title: newTitle,
          user_id: user.id,
        });

      if (error) throw error;

      setNewTitle("");
      setIsCreateModalOpen(false);
      fetchDecks();
    } catch (err) {
      console.error("Error creating deck:", err);
      alert("Fehler beim Erstellen des Decks.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Karteikarten</h1>
          <p className="text-white mt-1">
            Wähle ein Deck und beginne zu lernen.
          </p>
        </div>
        
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>Deck erstellen</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      ) : decks.length > 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {decks.map((deck, index) => (
            <motion.div
              key={deck.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <DeckCard deck={deck} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">Keine Decks gefunden. Erstelle das erste!</p>
        </div>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900">Neues Deck</h3>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleCreateDeck} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Titel
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-gray-900"
                    placeholder="z.B. Didaktik Grundlagen"
                  />
                </div>
                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="mr-3 px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
                  >
                    Abbrechen
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="flex items-center px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Erstelle...
                      </>
                    ) : (
                      "Erstellen"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

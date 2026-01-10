"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { Search, Plus, Loader2, X } from "lucide-react";
import ModuleCard from "@/components/features/ModuleCard";
import { Module } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

export default function SummariesPage() {
  const supabase = createClient();
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Form State
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("modules")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching modules:", error);
    } else if (data) {
      // Map DB data to Frontend Type
      const mappedModules: Module[] = data.map((m: any) => ({
        id: m.id,
        title: m.title,
        description: m.description,
        addedBy: "Community", // Placeholder, da wir keine Profile haben
        sections: [], // Werden erst im Detail geladen
        pdfs: [],
      }));
      setModules(mappedModules);
    }
    setIsLoading(false);
  };

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Nicht eingeloggt");

      // 1. Modul erstellen
      const { data: moduleData, error: moduleError } = await supabase
        .from("modules")
        .insert({
          title: newTitle,
          description: newDescription,
          user_id: user.id,
        })
        .select()
        .single();

      if (moduleError) throw moduleError;

      // 2. Sections erstellen
      const sectionsToCreate = [
        { type: "schwerpunkte", title: "Schwerpunkte" },
        { type: "begriffe", title: "Wichtige Begriffe" },
        { type: "beispiele", title: "Praxisbeispiele" },
        { type: "fragen", title: "Prüfungsfragen" },
        { type: "fazit", title: "Fazit" },
      ].map((s) => ({
        module_id: moduleData.id,
        type: s.type,
        title: s.title,
        content: "", // Leer initialisieren
      }));

      const { error: sectionsError } = await supabase
        .from("module_sections")
        .insert(sectionsToCreate);

      if (sectionsError) throw sectionsError;

      // Reset & Refresh
      setNewTitle("");
      setNewDescription("");
      setIsCreateModalOpen(false);
      fetchModules();
    } catch (err) {
      console.error("Error creating module:", err);
      alert("Fehler beim Erstellen des Moduls.");
    } finally {
      setIsCreating(false);
    }
  };

  const filteredModules = modules.filter((module) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      module.title.toLowerCase().includes(searchLower) ||
      module.description.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Zusammenfassungen</h1>
          <p className="text-white mt-1">
            Finde und lerne strukturierte Inhalte.
          </p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm transition-colors text-gray-900"
              placeholder="Suche..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors whitespace-nowrap shadow-lg"
          >
            <Plus className="w-5 h-5 md:mr-2" />
            <span className="hidden md:inline">Modul hinzufügen</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      ) : filteredModules.length > 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredModules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ModuleCard module={module} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">Keine Module gefunden. Erstelle das erste!</p>
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
                <h3 className="text-xl font-bold text-gray-900">Neues Modul</h3>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleCreateModule} className="p-6 space-y-4">
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
                    placeholder="z.B. Berufspädagogik I"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Beschreibung
                  </label>
                  <textarea
                    required
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-gray-900"
                    placeholder="Kurze Beschreibung des Inhalts..."
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

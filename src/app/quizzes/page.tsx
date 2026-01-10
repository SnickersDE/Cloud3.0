"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Quiz, Module } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Loader2, BrainCircuit, Clock, GraduationCap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function QuizzesPage() {
  const supabase = createClient();
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<(Quiz & { status?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState<Module[]>([]);

  // Create Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newModuleId, setNewModuleId] = useState("");
  const [newDifficulty, setNewDifficulty] = useState<"Grundlagen" | "Vertiefung" | "Prüfungsvorbereitung">("Grundlagen");
  const [isTimed, setIsTimed] = useState(false);
  const [timeLimit, setTimeLimit] = useState(10); // Default 10 minutes
  const [isCreating, setIsCreating] = useState(false);

  const fetchQuizzes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("quizzes")
        .select(`
          *,
          questions:quiz_questions(count)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      let attempts: any[] = [];
      if (user) {
        const { data: attemptsData } = await supabase
          .from("quiz_attempts")
          .select("quiz_id, score, max_score")
          .eq("user_id", user.id);
        attempts = attemptsData || [];
      }

      // Map the count and status correctly
      const quizzesWithStatus = data.map(q => {
        const qAttempts = attempts.filter(a => a.quiz_id === q.id);
        let status = "offen";
        
        if (qAttempts.length > 0) {
          // Check if any attempt is mastered (> 80%)
          const hasMastered = qAttempts.some(a => (a.score / a.max_score) >= 0.8);
          status = hasMastered ? "beherrscht" : "wiederholen";
        }

        return {
          ...q,
          question_count: q.questions?.[0]?.count || 0,
          status
        };
      });

      setQuizzes(quizzesWithStatus);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchModules = async () => {
    const { data } = await supabase.from("modules").select("id, title");
    if (data) setModules(data as Module[]);
  };

  useEffect(() => {
    fetchQuizzes();
    fetchModules();
  }, []);

  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Nicht eingeloggt");

      // 1. Create Quiz
      const { data: quizData, error: quizError } = await supabase
        .from("quizzes")
        .insert({
          title: newTitle,
          description: newDescription,
          module_id: newModuleId || null,
          difficulty: newDifficulty,
          time_limit_seconds: isTimed ? timeLimit * 60 : null,
          user_id: user.id
        })
        .select()
        .single();

      if (quizError) throw quizError;

      // 2. Create 3 default questions
      const defaultQuestions = Array(3).fill(null).map((_, i) => ({
        quiz_id: quizData.id,
        type: "multiple_choice",
        question: `Frage ${i + 1}`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        correct_answer: [0], // Default first option correct
        feedback: "Hier steht die Erklärung zur richtigen Antwort.",
        order: i
      }));

      const { error: questionsError } = await supabase
        .from("quiz_questions")
        .insert(defaultQuestions);

      if (questionsError) throw questionsError;

      // 3. Redirect to Quiz Detail/Edit page
      router.push(`/quizzes/${quizData.id}`);

    } catch (error) {
      console.error("Error creating quiz:", error);
      alert("Fehler beim Erstellen des Quiz.");
    } finally {
      setIsCreating(false);
      setIsCreateModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-8 pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Quiz & Prüfungen
            </h1>
            <p className="text-gray-400">Teste dein Wissen und bereite dich vor.</p>
          </div>
          
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="group flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 rounded-xl font-medium transition-all hover:scale-105 shadow-lg shadow-primary/20"
          >
            <Plus className="w-5 h-5" />
            Quiz erstellen
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : quizzes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz, index) => (
              <motion.div
                key={quiz.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/quizzes/${quiz.id}`} className="block h-full">
                  <div className="h-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-primary/50 hover:bg-gray-800 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-2">
                        <div className={`p-3 rounded-lg ${
                          quiz.difficulty === "Grundlagen" ? "bg-green-500/10 text-green-400" :
                          quiz.difficulty === "Vertiefung" ? "bg-blue-500/10 text-blue-400" :
                          "bg-red-500/10 text-red-400"
                        }`}>
                          <BrainCircuit className="w-6 h-6" />
                        </div>
                        {quiz.status && quiz.status !== "offen" && (
                          <div className={`p-3 rounded-lg flex items-center justify-center ${
                            quiz.status === "beherrscht" ? "bg-yellow-500/10 text-yellow-400" : "bg-orange-500/10 text-orange-400"
                          }`} title={quiz.status === "beherrscht" ? "Beherrscht" : "Wiederholen"}>
                             <GraduationCap className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      {quiz.time_limit_seconds && (
                        <div className="flex items-center text-xs font-medium text-gray-400 bg-gray-900/50 px-2 py-1 rounded">
                          <Clock className="w-3 h-3 mr-1" />
                          {Math.round(quiz.time_limit_seconds / 60)} min
                        </div>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                      {quiz.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {quiz.description || "Keine Beschreibung"}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-700">
                      <span className="text-xs font-medium text-gray-500 px-2 py-1 bg-gray-900 rounded border border-gray-700">
                        {quiz.difficulty}
                      </span>
                      <span className="text-xs text-gray-400">
                        {quiz.question_count || 0} Fragen
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-800/30 rounded-2xl border border-dashed border-gray-700">
            <BrainCircuit className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Keine Quizze vorhanden</h3>
            <p className="text-gray-400 mb-6">Erstelle das erste Quiz um dein Wissen zu testen.</p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="text-primary hover:text-primary/80 font-medium"
            >
              Jetzt erstellen
            </button>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-900 border border-gray-700 rounded-2xl p-8 w-full max-w-lg shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Neues Quiz erstellen</h2>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateQuiz} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Titel</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="z.B. Grundlagen der Didaktik"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Beschreibung</label>
                  <textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all h-24 resize-none"
                    placeholder="Worum geht es in diesem Quiz?"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Modul (Optional)</label>
                    <select
                      value={newModuleId}
                      onChange={(e) => setNewModuleId(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none"
                    >
                      <option value="">Kein Modul</option>
                      {modules.map(m => (
                        <option key={m.id} value={m.id}>{m.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Schwierigkeit</label>
                    <select
                      value={newDifficulty}
                      onChange={(e) => setNewDifficulty(e.target.value as any)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none"
                    >
                      <option value="Grundlagen">Grundlagen</option>
                      <option value="Vertiefung">Vertiefung</option>
                      <option value="Prüfungsvorbereitung">Prüfung</option>
                    </select>
                  </div>
                </div>

                <div className="border-t border-gray-800 pt-4 mt-2">
                  <label className="flex items-center space-x-3 cursor-pointer mb-3">
                    <input
                      type="checkbox"
                      checked={isTimed}
                      onChange={(e) => setIsTimed(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-700 text-primary focus:ring-primary bg-gray-800"
                    />
                    <span className="text-white font-medium">Zeitlimit aktivieren</span>
                  </label>

                  {isTimed && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="pl-8"
                    >
                      <label className="block text-sm font-medium text-gray-400 mb-1">Dauer (Minuten)</label>
                      <input
                        type="number"
                        min="1"
                        value={timeLimit}
                        onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      />
                    </motion.div>
                  )}
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-xl font-medium transition-colors flex items-center"
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Erstelle...
                      </>
                    ) : (
                      "Quiz erstellen"
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

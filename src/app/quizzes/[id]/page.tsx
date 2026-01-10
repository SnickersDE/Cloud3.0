"use client";

import { useEffect, useState, use } from "react";
import { createClient } from "@/utils/supabase/client";
import { Quiz, QuizQuestion } from "@/types";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Clock, BrainCircuit, Play, Save, Plus, ArrowLeft, Loader2, Edit3, Check } from "lucide-react";
import Link from "next/link";
import QuizQuestionEditor from "@/components/features/QuizQuestionEditor";

export default function QuizDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const supabase = createClient();
  const router = useRouter();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchQuiz = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from("quizzes")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setQuiz(data);
      setIsOwner(user?.id === data.user_id);

      const { data: qData, error: qError } = await supabase
        .from("quiz_questions")
        .select("*")
        .eq("quiz_id", id)
        .order("order", { ascending: true });

      if (qError) throw qError;
      setQuestions(qData || []);
    } catch (error) {
      console.error("Error fetching quiz:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  const handleSaveQuestions = async () => {
    setSaving(true);
    try {
      // Upsert questions
      const { error } = await supabase
        .from("quiz_questions")
        .upsert(questions.map((q, idx) => ({
          ...q,
          order: idx
        })));

      if (error) throw error;
      
      // Update quiz details if needed (not implemented in UI yet but good practice)
      setIsEditing(false);
      alert("Gespeichert!");
    } catch (error) {
      console.error("Error saving:", error);
      alert("Fehler beim Speichern.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateQuestion = (updated: QuizQuestion) => {
    setQuestions(prev => prev.map(q => q.id === updated.id ? updated : q));
  };

  const handleDeleteQuestion = async (qId: string) => {
    if (!confirm("Frage wirklich löschen?")) return;
    
    // Optimistic update
    setQuestions(prev => prev.filter(q => q.id !== qId));

    // Delete from DB
    const { error } = await supabase.from("quiz_questions").delete().eq("id", qId);
    if (error) {
      console.error("Error deleting question:", error);
      fetchQuiz(); // Revert on error
    }
  };

  const handleAddQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: crypto.randomUUID(), // Temp ID
      quiz_id: id,
      type: "multiple_choice",
      question: "",
      options: ["Option A", "Option B"],
      correct_answer: [0],
      feedback: "",
      order: questions.length
    };
    setQuestions([...questions, newQuestion]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!quiz) return <div>Quiz nicht gefunden.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-8 pt-24">
      <div className="max-w-4xl mx-auto">
        <Link href="/quizzes" className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück zur Übersicht
        </Link>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                   quiz.difficulty === "Grundlagen" ? "bg-green-500/10 text-green-400" :
                   quiz.difficulty === "Vertiefung" ? "bg-blue-500/10 text-blue-400" :
                   "bg-red-500/10 text-red-400"
                }`}>
                  {quiz.difficulty}
                </span>
                {quiz.time_limit_seconds && (
                  <span className="flex items-center text-xs font-medium text-gray-400 bg-gray-900/50 px-2 py-1 rounded">
                    <Clock className="w-3 h-3 mr-1" />
                    {Math.round(quiz.time_limit_seconds / 60)} min
                  </span>
                )}
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">{quiz.title}</h1>
              <p className="text-gray-400 text-lg">{quiz.description}</p>
            </div>
            
            <div className="text-right">
               <div className="text-3xl font-bold text-primary mb-1">{questions.length}</div>
               <div className="text-sm text-gray-500">Fragen</div>
            </div>
          </div>

          <div className="flex gap-4">
            <Link
              href={`/quizzes/${id}/play`}
              className="flex-1 bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-bold text-lg transition-all hover:scale-[1.02] shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5 fill-current" />
              Quiz Starten
            </Link>
            
            {isOwner && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`px-6 py-4 rounded-xl font-medium transition-all border ${
                  isEditing 
                    ? "bg-primary/10 border-primary text-primary" 
                    : "bg-gray-800 border-gray-700 text-gray-400 hover:text-white hover:border-gray-600"
                }`}
              >
                {isEditing ? <Check className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>

        {isEditing && isOwner && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">Fragen bearbeiten</h2>
              <button
                onClick={handleSaveQuestions}
                disabled={saving}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Speichern
              </button>
            </div>

            <div className="space-y-4">
              {questions.map((q) => (
                <QuizQuestionEditor
                  key={q.id}
                  question={q}
                  onUpdate={handleUpdateQuestion}
                  onDelete={handleDeleteQuestion}
                />
              ))}
            </div>

            <button
              onClick={handleAddQuestion}
              className="w-full py-4 border-2 border-dashed border-gray-700 rounded-xl text-gray-500 hover:text-primary hover:border-primary/50 hover:bg-gray-800/50 transition-all flex items-center justify-center gap-2 font-medium"
            >
              <Plus className="w-5 h-5" />
              Frage hinzufügen
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState, use } from "react";
import { createClient } from "@/utils/supabase/client";
import { Quiz, QuizQuestion, QuizAttempt } from "@/types";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, CheckCircle, XCircle, AlertCircle, ChevronRight, ChevronLeft, Flag, Trophy, RotateCcw, Check } from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";

export default function QuizPlayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const supabase = createClient();
  const router = useRouter();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Game State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [microText, setMicroText] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: qData, error: qError } = await supabase
          .from("quizzes")
          .select("*")
          .eq("id", id)
          .single();
        
        if (qError) throw qError;
        setQuiz(qData);
        if (qData.time_limit_seconds) {
          setTimeLeft(qData.time_limit_seconds);
        }

        const { data: qsData, error: qsError } = await supabase
          .from("quiz_questions")
          .select("*")
          .eq("quiz_id", id)
          .order("order", { ascending: true });
        
        if (qsError) throw qsError;
        setQuestions(qsData || []);
      } catch (err) {
        console.error("Error loading quiz:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Timer
  useEffect(() => {
    if (!timeLeft || isSubmitted) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 0) {
          clearInterval(timer);
          handleSubmit(); // Auto submit
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted]);

  const handleAnswer = (value: any) => {
    const currentQ = questions[currentQuestionIndex];
    
    if (currentQ.type === "multiple_choice") {
      // Toggle value in array
      const currentAnswers = (answers[currentQ.id] as number[]) || [];
      const newAnswers = currentAnswers.includes(value)
        ? currentAnswers.filter(v => v !== value)
        : [...currentAnswers, value];
      setAnswers({ ...answers, [currentQ.id]: newAnswers });
    } else {
      // SC or Short Answer
      setAnswers({ ...answers, [currentQ.id]: value });
    }
  };

  const handleSubmit = async () => {
    if (isSubmitted) return;
    
    let correctCount = 0;
    let totalScorable = 0;

    questions.forEach(q => {
      const userAnswer = answers[q.id];
      
      if (q.type === "short_answer") {
        // Not scored automatically
        return;
      }

      totalScorable++;
      const correctAnswer = q.correct_answer; // Array of indices

      if (q.type === "single_choice") {
        // Check if index matches
        if (userAnswer === correctAnswer[0]) correctCount++;
      } else if (q.type === "multiple_choice") {
        // Compare sorted arrays
        const userSorted = (userAnswer || []).sort().toString();
        const correctSorted = (correctAnswer || []).sort().toString();
        if (userSorted === correctSorted) correctCount++;
      }
    });

    const calculatedScore = correctCount;
    const calcPercentage = totalScorable > 0 ? Math.round((correctCount / totalScorable) * 100) : 100;
    
    setScore(calculatedScore);
    setPercentage(calcPercentage);

    // Micro-texts
    if (calcPercentage >= 90) {
      setMicroText("Hervorragend! Du hast das Thema gemeistert.");
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } else if (calcPercentage >= 70) {
      setMicroText("Gute Leistung, weiter so!");
    } else if (calcPercentage >= 50) {
      setMicroText("Solide Grundlage – jetzt vertiefen.");
    } else {
      setMicroText("Noch etwas Übung nötig. Bleib dran!");
    }

    setIsSubmitted(true);

    // Save attempt
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("quiz_attempts").insert({
          quiz_id: id,
          user_id: user.id,
          score: calculatedScore,
          max_score: totalScorable,
          status: "completed"
        });
      }
    } catch (err) {
      console.error("Error saving attempt:", err);
    }
  };

  if (loading || !quiz) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // --- RESULTS VIEW ---
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8 pt-24 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-2xl p-8 border border-gray-700 text-center mb-8 shadow-2xl"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-700 mb-6 relative">
              <Trophy className={`w-10 h-10 ${percentage >= 70 ? "text-yellow-400" : "text-gray-400"}`} />
              <div className="absolute inset-0 rounded-full border-4 border-primary/30" />
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="46"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-primary"
                  strokeDasharray={`${percentage * 2.89} 289`}
                  strokeLinecap="round"
                />
              </svg>
            </div>
            
            <h1 className="text-4xl font-bold mb-2">{percentage}%</h1>
            <p className="text-xl text-primary font-medium mb-2">{microText}</p>
            <p className="text-gray-400 text-sm">
              Du hast {score} von {questions.filter(q => q.type !== 'short_answer').length} bewertbaren Fragen richtig beantwortet.
            </p>

            <div className="flex justify-center gap-4 mt-8">
              <Link
                href="/quizzes"
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-medium transition-colors"
              >
                Zurück zur Übersicht
              </Link>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium transition-colors flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Quiz wiederholen
              </button>
            </div>
          </motion.div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">Detaillierte Auswertung</h2>
            {questions.map((q, idx) => {
              const userAnswer = answers[q.id];
              const correctAnswer = q.correct_answer;
              let isCorrect = false;

              if (q.type === "short_answer") {
                isCorrect = true; // Neutral for display
              } else if (q.type === "single_choice") {
                isCorrect = userAnswer === correctAnswer[0];
              } else {
                const userSorted = (userAnswer || []).sort().toString();
                const correctSorted = (correctAnswer || []).sort().toString();
                isCorrect = userSorted === correctSorted;
              }

              return (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`bg-gray-800 rounded-xl p-6 border ${
                    q.type === "short_answer" ? "border-blue-500/30" :
                    isCorrect ? "border-green-500/30" : "border-red-500/30"
                  }`}
                >
                  <div className="flex items-start gap-3 mb-4">
                    {q.type === "short_answer" ? (
                       <div className="mt-1"><Flag className="w-5 h-5 text-blue-400" /></div>
                    ) : isCorrect ? (
                      <div className="mt-1"><CheckCircle className="w-5 h-5 text-green-400" /></div>
                    ) : (
                      <div className="mt-1"><XCircle className="w-5 h-5 text-red-400" /></div>
                    )}
                    <div>
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 block">
                        Frage {idx + 1}
                      </span>
                      <h3 className="text-lg font-medium text-white">{q.question}</h3>
                    </div>
                  </div>

                  <div className="pl-8 space-y-2">
                    {q.type === "short_answer" ? (
                      <div className="bg-gray-900/50 p-4 rounded-lg">
                        <p className="text-sm text-gray-400 mb-2">Deine Antwort:</p>
                        <p className="text-white mb-4">{userAnswer || "Keine Antwort"}</p>
                        <div className="border-t border-gray-700 pt-3">
                          <p className="text-sm text-blue-400 font-medium mb-1">Feedback:</p>
                          <p className="text-gray-300 text-sm">{q.feedback}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {q.options?.map((opt, optIdx) => {
                          const isSelected = q.type === "single_choice" 
                            ? userAnswer === optIdx
                            : (userAnswer || []).includes(optIdx);
                          const isActuallyCorrect = (correctAnswer as number[]).includes(optIdx);
                          
                          return (
                            <div 
                              key={optIdx}
                              className={`p-3 rounded-lg flex justify-between items-center ${
                                isActuallyCorrect ? "bg-green-500/10 border border-green-500/30" :
                                isSelected ? "bg-red-500/10 border border-red-500/30" :
                                "bg-gray-900/30 border border-gray-700"
                              }`}
                            >
                              <span className={`text-sm ${
                                isActuallyCorrect ? "text-green-300" : 
                                isSelected ? "text-red-300" : "text-gray-400"
                              }`}>
                                {opt}
                              </span>
                              {isActuallyCorrect && <CheckCircle className="w-4 h-4 text-green-400" />}
                              {!isActuallyCorrect && isSelected && <XCircle className="w-4 h-4 text-red-400" />}
                            </div>
                          );
                        })}
                        {q.feedback && (
                           <div className="mt-3 p-3 bg-blue-500/5 rounded-lg border border-blue-500/10">
                              <p className="text-xs text-blue-400 font-bold mb-1">Erklärung:</p>
                              <p className="text-sm text-gray-300">{q.feedback}</p>
                           </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // --- PLAY VIEW ---
  const currentQ = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="h-16 border-b border-gray-800 flex items-center justify-between px-6 bg-gray-900/50 backdrop-blur fixed top-0 w-full z-10">
        <div className="flex items-center gap-4">
          <Link href="/quizzes" className="text-gray-400 hover:text-white">
             <XCircle className="w-6 h-6" />
          </Link>
          <div className="h-6 w-px bg-gray-800"></div>
          <div>
            <h1 className="text-sm font-bold text-white">{quiz.title}</h1>
            <div className="text-xs text-gray-500 flex items-center gap-2">
              <span>Frage {currentQuestionIndex + 1} von {questions.length}</span>
            </div>
          </div>
        </div>

        {timeLeft !== null && (
           <div className={`flex items-center gap-2 font-mono text-lg font-bold ${
             timeLeft < 60 ? "text-red-500 animate-pulse" : "text-primary"
           }`}>
             <Clock className="w-5 h-5" />
             {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
           </div>
        )}
      </header>

      {/* Progress Bar */}
      <div className="fixed top-16 w-full h-1 bg-gray-800 z-10">
        <motion.div 
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 pt-24 pb-24 max-w-3xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full"
          >
            <div className="mb-8">
              <span className="inline-block px-3 py-1 rounded-full bg-gray-800 text-gray-400 text-xs font-medium mb-4 border border-gray-700">
                {currentQ.type === "multiple_choice" ? "Mehrfachauswahl" : 
                 currentQ.type === "single_choice" ? "Einzelauswahl" : "Freitext"}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                {currentQ.question}
              </h2>
            </div>

            <div className="space-y-3">
              {currentQ.type === "short_answer" ? (
                <textarea
                  value={answers[currentQ.id] || ""}
                  onChange={(e) => handleAnswer(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none min-h-[150px] resize-none text-lg"
                  placeholder="Deine Antwort eingeben..."
                />
              ) : (
                currentQ.options?.map((option, idx) => {
                  const isSelected = currentQ.type === "single_choice"
                    ? answers[currentQ.id] === idx
                    : (answers[currentQ.id] as number[] || []).includes(idx);

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between group ${
                        isSelected 
                          ? "bg-primary/10 border-primary shadow-[0_0_20px_rgba(59,130,246,0.15)]" 
                          : "bg-gray-800 border-gray-700 hover:border-gray-600 hover:bg-gray-750"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          isSelected ? "border-primary bg-primary" : "border-gray-600 group-hover:border-gray-500"
                        }`}>
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className={`text-lg ${isSelected ? "text-white" : "text-gray-300"}`}>
                          {option}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer Controls */}
      <footer className="fixed bottom-0 w-full bg-gray-900 border-t border-gray-800 p-4">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <button
            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 transition-colors flex items-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" />
            Zurück
          </button>

          {currentQuestionIndex === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
            >
              Quiz abgeben
              <Flag className="w-5 h-5 fill-current" />
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
              className="px-6 py-3 bg-white text-black hover:bg-gray-100 rounded-xl font-bold transition-colors flex items-center gap-2"
            >
              Weiter
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}

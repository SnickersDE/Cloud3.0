"use client";

import { useState } from "react";
import { QuizQuestion, QuestionType } from "@/types";
import { Trash2, GripVertical, CheckCircle, Circle, Type, Info } from "lucide-react";
import { motion } from "framer-motion";

interface QuizQuestionEditorProps {
  question: QuizQuestion;
  onUpdate: (updatedQuestion: QuizQuestion) => void;
  onDelete: (id: string) => void;
}

export default function QuizQuestionEditor({ question, onUpdate, onDelete }: QuizQuestionEditorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleTypeChange = (newType: QuestionType) => {
    // Reset answer logic when type changes
    let newCorrectAnswer;
    if (newType === "short_answer") newCorrectAnswer = "";
    else if (newType === "single_choice") newCorrectAnswer = [0];
    else newCorrectAnswer = [0]; // MC

    onUpdate({
      ...question,
      type: newType,
      correct_answer: newCorrectAnswer,
      options: newType === "short_answer" ? undefined : (question.options || ["Option A", "Option B"]),
    });
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...(question.options || [])];
    newOptions[index] = value;
    onUpdate({ ...question, options: newOptions });
  };

  const addOption = () => {
    onUpdate({ ...question, options: [...(question.options || []), `Option ${question.options?.length ? question.options.length + 1 : 1}`] });
  };

  const removeOption = (index: number) => {
    const newOptions = question.options?.filter((_, i) => i !== index);
    onUpdate({ ...question, options: newOptions });
  };

  const toggleCorrectAnswer = (index: number) => {
    let newCorrect;
    if (question.type === "single_choice") {
      newCorrect = [index];
    } else {
      // MC
      const current = (question.correct_answer as number[]) || [];
      if (current.includes(index)) {
        newCorrect = current.filter(i => i !== index);
      } else {
        newCorrect = [...current, index];
      }
    }
    onUpdate({ ...question, correct_answer: newCorrect });
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden mb-4">
      <div 
        className="flex items-center p-4 cursor-pointer hover:bg-gray-750 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <GripVertical className="w-5 h-5 text-gray-500 mr-3" />
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-900 px-2 py-1 rounded">
              {question.type === "multiple_choice" ? "Multiple Choice" : 
               question.type === "single_choice" ? "Single Choice" : "Kurzantwort"}
            </span>
            <h4 className="font-medium text-white truncate max-w-md">{question.question || "Neue Frage"}</h4>
          </div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(question.id); }}
          className="p-2 text-gray-500 hover:text-red-400 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {isExpanded && (
        <div className="p-4 border-t border-gray-700 bg-gray-800/50">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Fragetyp</label>
                <select
                  value={question.type}
                  onChange={(e) => handleTypeChange(e.target.value as QuestionType)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                >
                  <option value="multiple_choice">Multiple Choice (Mehrere Antworten)</option>
                  <option value="single_choice">Single Choice (Eine Antwort)</option>
                  <option value="short_answer">Kurzantwort (Freitext)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Frage</label>
                <input
                  type="text"
                  value={question.question}
                  onChange={(e) => onUpdate({ ...question, question: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                  placeholder="Wie lautet die Frage?"
                />
              </div>
            </div>

            {question.type !== "short_answer" && (
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Antwortoptionen</label>
                <div className="space-y-2">
                  {question.options?.map((option, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <button
                        onClick={() => toggleCorrectAnswer(idx)}
                        className={`p-1 rounded-full transition-colors ${
                          (question.correct_answer as number[])?.includes(idx)
                            ? "text-green-400 bg-green-400/10"
                            : "text-gray-600 hover:text-gray-400"
                        }`}
                        title="Als richtig markieren"
                      >
                        {question.type === "single_choice" ? (
                          <Circle className={`w-5 h-5 ${(question.correct_answer as number[])?.includes(idx) ? "fill-current" : ""}`} />
                        ) : (
                          <CheckCircle className={`w-5 h-5 ${(question.correct_answer as number[])?.includes(idx) ? "fill-current" : ""}`} />
                        )}
                      </button>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(idx, e.target.value)}
                        className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                      />
                      <button
                        onClick={() => removeOption(idx)}
                        className="p-2 text-gray-600 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addOption}
                    className="text-sm text-primary hover:text-primary/80 font-medium px-2 py-1"
                  >
                    + Option hinzufügen
                  </button>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1 flex items-center gap-2">
                <Info className="w-3 h-3" /> Feedback / Erklärung
              </label>
              <textarea
                value={question.feedback}
                onChange={(e) => onUpdate({ ...question, feedback: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm h-20 resize-none"
                placeholder="Erklärung, die nach der Antwort angezeigt wird..."
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

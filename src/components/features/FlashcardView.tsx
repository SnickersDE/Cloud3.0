"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Flashcard } from "@/types";
import { RotateCcw } from "lucide-react";

interface FlashcardViewProps {
  card: Flashcard;
  onResult: (result: "known" | "unknown") => void;
}

export default function FlashcardView({ card, onResult }: FlashcardViewProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Reset flip state when card changes
  const handleNext = (result: "known" | "unknown") => {
    setIsFlipped(false);
    setTimeout(() => onResult(result), 200); // Wait for potential animation or just instant
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      <div 
        className="relative w-full aspect-[3/2] cursor-pointer perspective-1000"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <motion.div
          className="w-full h-full relative preserve-3d"
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front */}
          <div className="absolute inset-0 bg-white border border-gray-200 rounded-2xl shadow-lg flex flex-col items-center justify-center p-8 backface-hidden">
             <span className="text-sm text-gray-400 uppercase tracking-widest mb-4">Vorderseite</span>
             <h3 className="text-2xl md:text-4xl font-bold text-center text-gray-800">
               {card.front}
             </h3>
             <p className="absolute bottom-6 text-sm text-gray-400 flex items-center">
               <RotateCcw className="w-4 h-4 mr-2" />
               Klicken zum Umdrehen
             </p>
          </div>

          {/* Back */}
          <div 
            className="absolute inset-0 bg-primary border border-primary-dark rounded-2xl shadow-lg flex flex-col items-center justify-center p-8 backface-hidden"
            style={{ transform: "rotateY(180deg)" }}
          >
             <span className="text-sm text-white/70 uppercase tracking-widest mb-4">Rückseite</span>
             <h3 className="text-xl md:text-3xl font-medium text-center text-white">
               {card.back}
             </h3>
          </div>
        </motion.div>
      </div>

      <div className="flex gap-4 mt-12 w-full max-w-md">
        <button
          onClick={(e) => { e.stopPropagation(); handleNext("unknown"); }}
          className="flex-1 py-4 px-6 bg-white border border-red-200 text-red-600 rounded-xl hover:bg-red-50 hover:border-red-300 transition-colors font-semibold shadow-sm"
        >
          Nicht gewusst
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); handleNext("known"); }}
          className="flex-1 py-4 px-6 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors font-semibold shadow-sm"
        >
          Gewusst
        </button>
      </div>
    </div>
  );
}

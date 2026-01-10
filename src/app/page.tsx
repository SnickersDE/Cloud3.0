"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8 p-4">
      {/* Animated Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          filter: [
            "drop-shadow(0 0 15px rgba(74, 222, 128, 0.3))",
            "drop-shadow(0 0 30px rgba(74, 222, 128, 0.5))",
            "drop-shadow(0 0 15px rgba(74, 222, 128, 0.3))"
          ]
        }}
        transition={{
          opacity: { duration: 0.5 },
          scale: { duration: 0.5 },
          filter: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        className="relative w-64 h-64 md:w-96 md:h-96"
      >
        <Image 
          src="/logo.png" 
          alt="Berufspädagogik Logo" 
          fill 
          className="object-contain"
          priority
        />
      </motion.div>

      <p className="text-xl md:text-2xl text-white max-w-2xl">
       WILLKOMMEN AUF DER MODERNEN PLATTFORM FÜR BERUFSPÄDAGOGEN
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 w-full max-w-4xl">
        {/* Zusammenfassungen */}
        <Link href="/summaries" className="block h-full">
          <motion.div 
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            whileTap={{ scale: 0.98 }}
            className="p-6 bg-white/5 rounded-xl transition-all border border-white/10 h-full flex flex-col justify-start hover:border-primary/50"
          >
            <h3 className="text-2xl font-semibold mb-2 text-primary">Zusammenfassungen</h3>
            <p className="text-white/80">
              Greife auf strukturierte Modulinhalte zu, lade PDFs herunter und bearbeite deine Lernunterlagen.
            </p>
          </motion.div>
        </Link>

        {/* Karteikarten */}
        <Link href="/flashcards" className="block h-full">
          <motion.div 
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            whileTap={{ scale: 0.98 }}
            className="p-6 bg-white/5 rounded-xl transition-all border border-white/10 h-full flex flex-col justify-start hover:border-primary/50"
          >
            <h3 className="text-2xl font-semibold mb-2 text-primary">Karteikarten</h3>
            <p className="text-white/80">
              Lerne effizient mit unserem integrierten Karteikartensystem. Erstelle Decks und tracke deinen Fortschritt.
            </p>
          </motion.div>
        </Link>

        {/* Quiz */}
        <Link href="/quizzes" className="block h-full">
          <motion.div 
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            whileTap={{ scale: 0.98 }}
            className="p-6 bg-white/5 rounded-xl transition-all border border-white/10 h-full flex flex-col justify-start hover:border-primary/50"
          >
            <h3 className="text-2xl font-semibold mb-2 text-primary">Quiz</h3>
            <p className="text-white/80">
               Teste dein Wissen mit interaktiven Quizzes. Verschiedene Modi und detaillierte Auswertungen helfen dir, deinen Lernstand zu überprüfen.
            </p>
          </motion.div>
        </Link>

        {/* Vernetzen */}
        <motion.div 
             whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
             className="p-6 bg-white/5 rounded-xl transition-all border border-white/10 h-full flex flex-col justify-start cursor-default hover:border-primary/50"
        >
          <h3 className="text-2xl font-semibold mb-2 text-primary">Vernetzen</h3>
          <p className="text-white/80">
            Der aktive Austausch und die Vernetzung mit Kommilitonen fördern das Verständnis komplexer Inhalte. Gemeinsames Reflektieren stärkt die pädagogische Professionalität nachhaltig.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
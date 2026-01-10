"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, LogOut } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";

export default function Navbar() {
  const router = useRouter();
  const supabase = createClient();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    
    // Auth Status Check
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();

    // Listen for Auth Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
    router.refresh();
  };

  const navLinks = user
    ? [
        { href: "/summaries", label: "Zusammenfassungen" },
        { href: "/flashcards", label: "Karteikarten" },
        { href: "/quizzes", label: "Quiz" },
      ]
    : [
        { href: "/register", label: "Registrieren" },
        { href: "/login", label: "Anmelden" },
      ];

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-secondary/80 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary tracking-tight">
            Berufspädagogik
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white hover:text-primary transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
            {user && (
               <button 
                onClick={handleLogout}
                className="p-2 rounded-full hover:bg-white/10 transition-colors flex items-center gap-2 text-white"
                title="Abmelden"
               >
                 <User className="w-5 h-5" />
                 <span className="text-sm font-medium">Abmelden</span>
               </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-secondary border-b border-gray-700"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-primary transition-colors font-medium text-lg"
                >
                  {link.label}
                </Link>
              ))}
               {user && (
               <button 
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="text-left text-white hover:text-primary transition-colors font-medium text-lg flex items-center gap-2"
               >
                 <LogOut className="w-5 h-5" />
                 Abmelden
               </button>
            )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

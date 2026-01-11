"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, LogOut } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    // Check if logo should be shown based on session or current path
    const sessionLogo = sessionStorage.getItem("logoShown");
    
    if (sessionLogo === "true") {
      setShowLogo(true);
    } else {
      // If not shown yet, check if we are on a valid subpage (not home/login/register)
      const excludedPaths = ["/", "/login", "/register"];
      if (!excludedPaths.includes(pathname)) {
        setShowLogo(true);
        sessionStorage.setItem("logoShown", "true");
      }
    }
  }, [pathname]);

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

  const handleHomeClick = () => {
    if (pathname === "/") return;
    setShowLogo(false);
    sessionStorage.removeItem("logoShown");
  };

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
          <div className="flex items-center">
            <AnimatePresence>
              {showLogo && (
                <motion.div
                  initial={{ opacity: 0, x: 20, width: 0, marginRight: 0 }}
                  animate={{ opacity: 1, x: 0, width: "auto", marginRight: 12 }}
                  exit={{ opacity: 0, x: 20, width: 0, marginRight: 0 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="flex items-center overflow-hidden"
                >
                  <Image 
                    src="/logo.png" 
                    alt="Logo" 
                    width={40} 
                    height={40} 
                    className="object-contain"
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <Link 
              href="/" 
              onClick={handleHomeClick}
              className="text-2xl font-bold text-white tracking-tight uppercase"
            >
              Berufspädagogik
            </Link>
          </div>

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

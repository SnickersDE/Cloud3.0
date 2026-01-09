"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, LogIn } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Mock Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = isAuthenticated
    ? [
        { href: "/summaries", label: "Zusammenfassungen" },
        { href: "/flashcards", label: "Karteikarten" },
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
            {isAuthenticated ? (
               <button 
                onClick={() => setIsAuthenticated(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
               >
                 <User className="w-5 h-5 text-white" />
               </button>
            ) : (
              <button 
                onClick={() => setIsAuthenticated(true)} // Toggle for Demo
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Demo Login</span>
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
               {isAuthenticated ? (
               <button 
                onClick={() => {
                  setIsAuthenticated(false);
                  setIsOpen(false);
                }}
                className="text-left text-white hover:text-primary transition-colors font-medium text-lg"
               >
                 Abmelden
               </button>
            ) : (
              <button 
                onClick={() => {
                  setIsAuthenticated(true);
                  setIsOpen(false);
                }}
                className="text-left text-primary font-bold hover:text-primary-dark transition-colors text-lg"
              >
                Demo Login
              </button>
            )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

"use client";

import { useState } from "react";
import { Section } from "@/types";
import { Settings, Save, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SectionItemProps {
  section: Section;
  onUpdate: (updatedSection: Section) => void;
}

export default function SectionItem({ section, onUpdate }: SectionItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(section.content);

  const handleSave = () => {
    onUpdate({ ...section, content });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setContent(section.content);
    setIsEditing(false);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden mb-6">
      <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-b border-gray-100">
        <h3 className="text-lg font-bold text-primary">{section.title}</h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-gray-400 hover:text-primary transition-colors p-1"
          title={isEditing ? "Abbrechen" : "Bearbeiten"}
        >
          {isEditing ? <X className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
        </button>
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div
              key="edit"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <textarea
                className="w-full h-48 p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono text-sm resize-y"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <div className="flex justify-end mt-4 gap-2">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Speichern
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="prose max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
                {section.content}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

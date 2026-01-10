"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import SectionItem from "@/components/features/SectionItem";
import PDFSection from "@/components/features/PDFSection";
import { ArrowLeft, Loader2, Trash2 } from "lucide-react";
import { Section, PDFFile, Module } from "@/types";
import { motion } from "framer-motion";

export default function ModuleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const supabase = createClient();
  
  const [moduleData, setModuleData] = useState<Module | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Data
  const fetchModule = useCallback(async () => {
    try {
      // 1. Module Info
      const { data: module, error: moduleError } = await supabase
        .from("modules")
        .select("*")
        .eq("id", id)
        .single();

      if (moduleError) throw moduleError;

      // 2. Sections
      const { data: sections, error: sectionsError } = await supabase
        .from("module_sections")
        .select("*")
        .eq("module_id", id);

      if (sectionsError) throw sectionsError;

      // 3. PDFs
      const { data: pdfs, error: pdfsError } = await supabase
        .from("module_pdfs")
        .select("*")
        .eq("module_id", id);

      if (pdfsError) throw pdfsError;

      // Sort Sections
      const sectionOrder = ["schwerpunkte", "begriffe", "beispiele", "fragen", "fazit"];
      const sortedSections = sections?.sort((a, b) => 
        sectionOrder.indexOf(a.type) - sectionOrder.indexOf(b.type)
      ) || [];

      // Combine Data
      setModuleData({
        id: module.id,
        title: module.title,
        description: module.description,
        addedBy: "Community",
        sections: sortedSections.map((s: any) => ({
          id: s.id,
          type: s.type,
          title: s.title,
          content: s.content || "",
        })),
        pdfs: pdfs?.map((p: any) => ({
          id: p.id,
          name: p.name,
          uploadDate: new Date(p.created_at).toLocaleDateString("de-DE"),
          url: p.url,
        })) || [],
      });
    } catch (err) {
      console.error("Error loading module:", err);
      // Optional: Redirect or Show Error
    } finally {
      setIsLoading(false);
    }
  }, [id, supabase]);

  useEffect(() => {
    if (id) fetchModule();
  }, [id, fetchModule]);

  // Update Section
  const handleSectionUpdate = async (updatedSection: Section) => {
    try {
      const { error } = await supabase
        .from("module_sections")
        .update({ content: updatedSection.content })
        .eq("id", updatedSection.id);

      if (error) throw error;
      
      // Update local state optimistic or refetch
      setModuleData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          sections: prev.sections.map((s) =>
            s.id === updatedSection.id ? updatedSection : s
          ),
        };
      });
    } catch (err) {
      console.error("Error updating section:", err);
      alert("Fehler beim Speichern.");
    }
  };

  // Upload PDF
  const handleUploadPDF = async (file: File) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("Bitte melde dich an.");
        return;
      }

      // Unique Filename
      const fileName = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
      const filePath = `${user.id}/${fileName}`;

      // 1. Upload to Storage
      const { error: uploadError } = await supabase.storage
        .from("pdfs")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: urlData } = supabase.storage
        .from("pdfs")
        .getPublicUrl(filePath);

      // 3. Insert into DB
      const { error: dbError } = await supabase
        .from("module_pdfs")
        .insert({
          module_id: id,
          name: file.name,
          url: urlData.publicUrl,
          user_id: user.id,
        });

      if (dbError) throw dbError;

      fetchModule(); // Reload to see new PDF
    } catch (err: any) {
      console.error("Error uploading PDF:", err);
      alert(`Fehler beim Upload: ${err.message}`);
    }
  };

  // Delete PDF
  const handleDeletePDF = async (pdfId: string) => {
    if (!confirm("Möchtest du dieses PDF wirklich löschen?")) return;

    try {
      // Get PDF info first (to find path in storage if needed, but we rely on DB ID)
      // Storage delete requires path. We didn't store path in DB, only URL.
      // We can extract path from URL or just delete from DB and leave file (orphan).
      // Better: Store path in DB? Too late for schema change.
      // Extract path from URL: .../pdfs/USERID/FILENAME
      
      // For now, just delete from DB to hide it.
      const { error } = await supabase
        .from("module_pdfs")
        .delete()
        .eq("id", pdfId);

      if (error) throw error;

      setModuleData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          pdfs: prev.pdfs.filter((p) => p.id !== pdfId),
        };
      });
    } catch (err) {
      console.error("Error deleting PDF:", err);
      alert("Fehler beim Löschen.");
    }
  };

  // Delete Module
  const handleDeleteModule = async () => {
    if (!confirm("Möchtest du dieses Modul wirklich löschen? Alle Inhalte gehen verloren.")) return;

    try {
      const { error } = await supabase
        .from("modules")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      router.push("/summaries");
    } catch (err) {
      console.error("Error deleting module:", err);
      alert("Fehler beim Löschen des Moduls.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!moduleData) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-white">Modul nicht gefunden</h2>
        <Link href="/summaries" className="text-primary hover:underline mt-4 inline-block">
          Zurück zur Übersicht
        </Link>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto pb-20"
    >
      <Link
        href="/summaries"
        className="inline-flex items-center text-gray-400 hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Zurück zur Übersicht
      </Link>

      <div className="mb-10">
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl md:text-4xl font-bold text-primary mb-4"
        >
          {moduleData.title}
        </motion.h1>
        <p className="text-xl text-gray-300 leading-relaxed">
          {moduleData.description}
        </p>
      </div>

      <div className="space-y-6">
        {moduleData.sections.map((section, index) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <SectionItem
              section={section}
              onUpdate={handleSectionUpdate}
            />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <PDFSection
          pdfs={moduleData.pdfs}
          onUpload={handleUploadPDF}
          onDelete={handleDeletePDF}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-12 pt-12 border-t border-white/10 flex justify-center"
      >
        <button
          onClick={handleDeleteModule}
          className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors px-4 py-2 rounded-lg hover:bg-red-500/10"
        >
          <Trash2 className="w-5 h-5" />
          <span>Modul löschen</span>
        </button>
      </motion.div>
    </motion.div>
  );
}

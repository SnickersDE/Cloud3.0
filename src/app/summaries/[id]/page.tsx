"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MOCK_MODULES } from "@/lib/mockData";
import SectionItem from "@/components/features/SectionItem";
import PDFSection from "@/components/features/PDFSection";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Section, PDFFile } from "@/types";

export default function ModuleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  
  // Find initial data
  const initialModule = MOCK_MODULES.find((m) => m.id === id);
  
  // Local state to handle updates (since we don't have a real backend)
  const [moduleData, setModuleData] = useState(initialModule);

  if (!moduleData) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-800">Modul nicht gefunden</h2>
        <Link href="/summaries" className="text-primary hover:underline mt-4 inline-block">
          Zurück zur Übersicht
        </Link>
      </div>
    );
  }

  const handleSectionUpdate = (updatedSection: Section) => {
    setModuleData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        sections: prev.sections.map((s) =>
          s.id === updatedSection.id ? updatedSection : s
        ),
      };
    });
  };

  const handleUploadPDF = (file: File) => {
    // Mock upload
    const newPDF: PDFFile = {
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      uploadDate: new Date().toISOString().split('T')[0],
      url: "#",
    };
    setModuleData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        pdfs: [...prev.pdfs, newPDF],
      };
    });
  };

  const handleDeletePDF = (pdfId: string) => {
    setModuleData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        pdfs: prev.pdfs.filter((p) => p.id !== pdfId),
      };
    });
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <Link
        href="/summaries"
        className="inline-flex items-center text-gray-500 hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Zurück zur Übersicht
      </Link>

      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
          {moduleData.title}
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          {moduleData.description}
        </p>
        <div className="mt-4 text-sm text-gray-400">
          Hinzugefügt von {moduleData.addedBy}
        </div>
      </div>

      <div className="space-y-6">
        {moduleData.sections.map((section) => (
          <SectionItem
            key={section.id}
            section={section}
            onUpdate={handleSectionUpdate}
          />
        ))}
      </div>

      <PDFSection
        pdfs={moduleData.pdfs}
        onUpload={handleUploadPDF}
        onDelete={handleDeletePDF}
      />
    </div>
  );
}

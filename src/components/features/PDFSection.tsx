"use client";

import { useState } from "react";
import { PDFFile } from "@/types";
import { FileText, Download, Upload, Trash2 } from "lucide-react";

interface PDFSectionProps {
  pdfs: PDFFile[];
  onUpload: (file: File) => void; // Mock upload
  onDelete: (id: string) => void; // Mock delete
}

export default function PDFSection({ pdfs, onUpload, onDelete }: PDFSectionProps) {
  // Mock upload handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 mt-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-primary">Dokumente & PDFs</h3>
        <label className="cursor-pointer flex items-center px-4 py-2 bg-gray-100 text-secondary hover:bg-gray-200 rounded-lg transition-colors font-medium text-sm">
          <Upload className="w-4 h-4 mr-2" />
          PDF hochladen
          <input type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
        </label>
      </div>

      {pdfs.length > 0 ? (
        <div className="space-y-3">
          {pdfs.map((pdf) => (
            <div
              key={pdf.id}
              className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center mr-3">
                  <FileText className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{pdf.name}</p>
                  <p className="text-xs text-gray-500">{pdf.uploadDate}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  className="p-2 text-gray-400 hover:text-primary transition-colors"
                  title="Download"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onDelete(pdf.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Löschen"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-lg">
          <p className="text-gray-400 text-sm">Keine Dokumente vorhanden.</p>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { MOCK_MODULES } from "@/lib/mockData";
import ModuleCard from "@/components/features/ModuleCard";
import { Search } from "lucide-react";

export default function SummariesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredModules = MOCK_MODULES.filter((module) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      module.title.toLowerCase().includes(searchLower) ||
      module.description.toLowerCase().includes(searchLower) ||
      module.sections.some(section => section.content.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Zusammenfassungen</h1>
          <p className="text-white mt-1">
            Finde und lerne strukturierte Inhalte.
          </p>
        </div>
        
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm transition-colors"
            placeholder="Suche nach Modulen, Inhalten..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredModules.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((module) => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Keine Module gefunden.</p>
        </div>
      )}
    </div>
  );
}

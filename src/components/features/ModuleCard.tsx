import Link from "next/link";
import { Module } from "@/types";
import { ArrowRight, User } from "lucide-react";

interface ModuleCardProps {
  module: Module;
}

export default function ModuleCard({ module }: ModuleCardProps) {
  return (
    <Link href={`/summaries/${module.id}`}>
      <div className="group h-full bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-primary-dark transition-colors">
            {module.title}
          </h3>
          <p className="text-gray-600 line-clamp-3 mb-4">
            {module.description}
          </p>
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
          <div className="flex items-center text-sm text-gray-500">
            <User className="w-4 h-4 mr-2" />
            <span>{module.addedBy}</span>
          </div>
          <div className="text-primary opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>
      </div>
    </Link>
  );
}

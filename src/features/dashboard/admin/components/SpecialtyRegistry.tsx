"use client";

import React, { useState } from "react";
import { Specialty } from "@/types";
import { Plus, Trash2 } from "lucide-react";
import { CustomModal } from "@/components/ui/custom-modal";

interface SpecialtyRegistryProps {
  specialties: Specialty[];
  addSpecialty: (title: string, description: string, icon: string) => void;
  deleteSpecialty: (id: string) => void;
}

export function SpecialtyRegistry({
  specialties,
  addSpecialty,
  deleteSpecialty,
}: SpecialtyRegistryProps) {
  const [specialtyModalOpen, setSpecialtyModalOpen] = useState(false);
  const [specialtyTitle, setSpecialtyTitle] = useState("");
  const [specialtyDesc, setSpecialtyDesc] = useState("");

  const handleAddSpecialtySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!specialtyTitle || !specialtyDesc) return;
    addSpecialty(specialtyTitle, specialtyDesc, "");
    setSpecialtyTitle("");
    setSpecialtyDesc("");
    setSpecialtyModalOpen(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
      {/* Specialties List */}
      <div className="lg:col-span-12 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-850">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Specialty Directory</h2>
            <p className="text-xs text-slate-400 mt-0.5">List of medical specialties currently active in the clinic database.</p>
          </div>
          <button
            type="button"
            onClick={() => setSpecialtyModalOpen(true)}
            className="bg-primary hover:bg-primary/95 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add Specialty
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {specialties.map(spec => (
            <div key={spec.id} className="p-4 bg-slate-55 dark:bg-slate-850 rounded-2xl border border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center p-2 border border-slate-100 dark:border-slate-800">
                  <img src={spec.icon} alt={spec.title} className="h-full w-full object-contain" />
                </div>
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">{spec.title}</span>
                  <span className="text-[10px] text-slate-400 truncate max-w-[150px] block mt-0.5">{spec.description}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => deleteSpecialty(spec.id)}
                className="p-2 hover:bg-red-50 text-red-500 rounded-xl cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Specialty Modal form */}
      <CustomModal
        isOpen={specialtyModalOpen}
        onClose={() => setSpecialtyModalOpen(false)}
        title="Register Medical Specialty"
      >
        <form onSubmit={handleAddSpecialtySubmit} className="space-y-4 text-xs sm:text-sm">
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Specialty Title</label>
            <input
              type="text"
              required
              value={specialtyTitle}
              onChange={(e) => setSpecialtyTitle(e.target.value)}
              placeholder="Cardiology / Neurology"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-hidden"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Description</label>
            <textarea
              rows={4}
              required
              value={specialtyDesc}
              onChange={(e) => setSpecialtyDesc(e.target.value)}
              placeholder="Summarize specialty clinical treatments..."
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-hidden resize-none"
            />
          </div>
          
          <div className="flex gap-2 justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setSpecialtyModalOpen(false)}
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary hover:bg-primary/95 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md cursor-pointer"
            >
              Add Specialty
            </button>
          </div>
        </form>
      </CustomModal>
    </div>
  );
}

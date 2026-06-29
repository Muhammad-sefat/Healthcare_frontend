"use client";

import React, { useState } from "react";
import { Schedule } from "@/types";
import { Plus } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { toast } from "sonner";

interface GenerateSchedulesProps {
  schedules: Schedule[];
  generateSchedules: (startDate: string, endDate: string, startTime: string, endTime: string) => void;
}

export function GenerateSchedules({
  schedules,
  generateSchedules,
}: GenerateSchedulesProps) {
  // Schedule template generator inputs
  const [genStartD, setGenStartD] = useState("2026-07-01");
  const [genEndD, setGenEndD] = useState("2026-07-05");
  const [genStartT, setGenStartT] = useState("09:00");
  const [genEndT, setGenEndT] = useState("17:00");

  const handleGenerateSlotsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateSchedules(genStartD, genEndD, genStartT, genEndT);
    toast.success("System schedules generated dynamically.");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
      {/* Generator Form Panel */}
      <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
        <form onSubmit={handleGenerateSlotsSubmit} className="space-y-5 text-xs">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-850">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Clinic Slot Generator</h3>
            <p className="text-[10px] text-slate-400 mt-1">Generate 30-minute interval blocks daily across a specified date range.</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-slate-400 uppercase">Start Date</label>
              <DatePicker
                value={genStartD}
                onChange={setGenStartD}
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-slate-400 uppercase">End Date</label>
              <DatePicker
                value={genEndD}
                onChange={setGenEndD}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-slate-400 uppercase">Start Time</label>
              <input
                type="time"
                value={genStartT}
                onChange={(e) => setGenStartT(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-205 dark:border-slate-700"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-slate-400 uppercase">End Time</label>
              <input
                type="time"
                value={genEndT}
                onChange={(e) => setGenEndT(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-205 dark:border-slate-700"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary/95 text-white py-2.5 rounded-xl font-bold shadow-md cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Generate Time Blocks
          </button>
        </form>
      </div>

      {/* Slots Table Grid */}
      <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-50 dark:border-slate-850 pb-3">
          Generated System Time Blocks ({schedules.length})
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto pr-1">
          {schedules.map((slot) => {
            const startStr = new Date(slot.startDateTime).toLocaleDateString("en-US", { month: "short", day: "numeric" }) + " @ " + new Date(slot.startDateTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
            return (
              <div key={slot.id} className="p-3 bg-slate-55 dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-350 flex justify-between items-center">
                <span>{startStr}</span>
                {slot.isBooked && (
                  <span className="bg-emerald-100 text-emerald-700 px-1 py-0.5 rounded-sm font-bold">Booked</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

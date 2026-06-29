"use client";

import React from "react";
import { Schedule, Doctor } from "@/types";
import { Calendar } from "lucide-react";
import { mockDoctorSchedules } from "../data/mockDoctorData";

interface ManageSlotsProps {
  schedules: Schedule[];
  currentProfile: Doctor | null;
  claimSlot: (id: string) => void;
  releaseSlot: (id: string) => void;
}

export function ManageSlots({
  schedules,
  currentProfile,
  claimSlot,
  releaseSlot,
}: ManageSlotsProps) {
  if (!currentProfile) return null;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-6 shadow-xs animate-fadeIn space-y-6">
      <div className="pb-4 border-b border-slate-100 dark:border-slate-850">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">My Claims Schedule Slots</h2>
        <p className="text-xs text-slate-450 dark:text-slate-400 mt-1">Claim general clinic schedule intervals so patients can discover and book consultations. release unbooked claimed slots.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {schedules.map((slot) => {
          // Check if claimed by this doctor
          const link = mockDoctorSchedules.find(ds => ds.scheduleId === slot.id && ds.doctorId === currentProfile.id);
          const isClaimed = !!link;
          const isBooked = slot.isBooked;

          const startTimeStr = new Date(slot.startDateTime).toLocaleDateString("en-US", { month: "short", day: "numeric" }) + " @ " + new Date(slot.startDateTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

          return (
            <div
              key={slot.id}
              className={`p-4 rounded-2xl border text-xs flex flex-col justify-between h-32 transition-all ${
                isBooked
                  ? "bg-slate-50 dark:bg-slate-850 border-slate-250 text-slate-400"
                  : isClaimed
                  ? "bg-primary/5 border-primary text-primary"
                  : "bg-white dark:bg-slate-900 border-slate-150 dark:border-slate-800 text-slate-650"
              }`}
            >
              <div>
                <span className="block font-bold leading-tight">{startTimeStr}</span>
                <span className="block text-[9px] text-slate-400 uppercase font-semibold mt-1">
                  {isBooked ? "Booked by Patient" : isClaimed ? "Active Claim" : "Clinic Template"}
                </span>
              </div>
              
              {!isBooked && (
                <button
                  type="button"
                  onClick={() => isClaimed ? releaseSlot(slot.id) : claimSlot(slot.id)}
                  className={`w-full py-1.5 rounded-lg font-bold text-[10px] transition-all cursor-pointer ${
                    isClaimed
                      ? "bg-rose-50 text-rose-500 hover:bg-rose-100/50"
                      : "bg-primary text-white hover:bg-primary/95 shadow-xs"
                  }`}
                >
                  {isClaimed ? "Release Slot" : "Claim Slot"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

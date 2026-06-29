"use client";

import React from "react";
import { Review } from "@/types";
import { Star } from "lucide-react";

interface DoctorReviewsProps {
  doctorReviews: Review[];
}

export function DoctorReviews({
  doctorReviews,
}: DoctorReviewsProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-6 shadow-xs animate-fadeIn space-y-6">
      <div className="pb-4 border-b border-slate-100 dark:border-slate-850">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Patient Feedback Feed</h2>
        <p className="text-xs text-slate-450 dark:text-slate-400 mt-1">Ratings and notes submitted by patients after completed consultations.</p>
      </div>

      <div className="space-y-6">
        {doctorReviews.length > 0 ? (
          doctorReviews.map((rev) => (
            <div key={rev.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-slate-200 overflow-hidden">
                    <img
                      src={rev.patient.profilePhoto || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=30"}
                      alt={rev.patient.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-900 dark:text-white">{rev.patient.name}</span>
                    <span className="block text-[9px] text-slate-400 font-medium">
                      {new Date(rev.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                </div>
                <div className="flex gap-0.5 text-amber-500">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-500 text-amber-550" />
                  ))}
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 pl-12 leading-relaxed">
                {rev.comment}
              </p>
              <hr className="border-slate-50 dark:border-slate-855/50 mt-4" />
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-slate-400 text-xs font-medium">
            No patient reviews submitted.
          </div>
        )}
      </div>
    </div>
  );
}

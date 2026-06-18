"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/providers/authProvider";
import { Star, ArrowRight } from "lucide-react";

export function FeaturedDoctors() {
  const { doctors } = useAuth();
  
  // Filter out deleted doctors and take top 3
  const activeDoctors = doctors.filter(d => !d.isDeleted).slice(0, 3);

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4">
          <div className="text-center sm:text-left space-y-2">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Featured Medical Specialists
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Highly recommended doctors available for online video consultations.
            </p>
          </div>
          <Link 
            href="/doctors" 
            className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 text-slate-700 dark:text-slate-300 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-xs transition-all"
          >
            See All Doctors
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {activeDoctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-150 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
            >
              {/* Doctor Head */}
              <div className="p-6 pb-4 flex gap-4 items-center">
                <img
                  src={doc.profilePhoto}
                  alt={doc.name}
                  className="h-16 w-16 rounded-2xl object-cover border border-slate-100 dark:border-slate-700"
                />
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white hover:text-primary">
                    <Link href={`/doctors/${doc.id}`}>{doc.name}</Link>
                  </h3>
                  <p className="text-xs text-slate-555 font-medium">{doc.designation}</p>
                  <p className="text-xs text-primary font-semibold mt-0.5">{doc.specialties[0]?.specialty?.title}</p>
                </div>
              </div>

              {/* Info divider */}
              <div className="px-6 py-4 border-t border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 grid grid-cols-3 gap-2 text-center">
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Exp</span>
                  <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{doc.experience} Years</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Fee</span>
                  <span className="font-bold text-sm text-primary">৳{doc.appointmentFee}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Rating</span>
                  <span className="font-bold text-sm text-amber-500 flex items-center justify-center gap-0.5">
                    <Star className="h-3.5 w-3.5 fill-amber-500" /> {doc.averageRating}
                  </span>
                </div>
              </div>

              {/* Details Footer */}
              <div className="p-6 mt-auto flex flex-col gap-2">
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                  {doc.qualification} &bull; Currently working as {doc.designation} at {doc.currentWorkplace}.
                </p>
                <Link
                  href={`/doctors/${doc.id}`}
                  className="mt-4 w-full bg-primary/10 hover:bg-primary text-primary hover:text-white py-3 rounded-xl text-xs font-bold tracking-wide transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
                >
                  Book Appointment
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

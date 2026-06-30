"use client";

import React from "react";
import Link from "next/link";
import { useSpecialties } from "../hooks/useSpecialties";

export function Specialties() {
  const { data: specialtiesResponse, isLoading } = useSpecialties();
  const specialtiesData = specialtiesResponse?.data || [];

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Consult by Medical Specialty
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Find specialists immediately across multiple disciplines. Our qualified doctors are ready to address your concerns online.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-150 dark:border-slate-800 animate-pulse flex flex-col items-center">
                <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-4" />
                <div className="h-4 w-24 bg-slate-100 dark:bg-slate-800 rounded-md mb-2" />
                <div className="h-3 w-16 bg-slate-100 dark:bg-slate-800 rounded-md" />
              </div>
            ))
          ) : specialtiesData.length > 0 ? (
            specialtiesData.map((spec) => (
              <Link
                key={spec.id}
                href={`/doctors?specialty=${spec.id}`}
                className="group bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-150 dark:border-slate-800 shadow-xs hover:shadow-lg hover:-translate-y-1 hover:border-primary/50 transition-all duration-300 flex flex-col items-center text-center"
              >
                <div className="h-16 w-16 bg-slate-50 group-hover:bg-primary/10 dark:bg-slate-800 rounded-2xl flex items-center justify-center p-3 mb-4 transition-colors">
                  <img src={spec.icon} alt={spec.title} className="h-full w-full object-contain animate-none" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                  {spec.title}
                </h3>
                <span className="text-[11px] text-slate-400 mt-1 dark:text-slate-500 font-medium">
                  View Doctors
                </span>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-10 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-slate-450 dark:text-slate-500 text-xs font-semibold">
              No specialties available at the moment.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
export default Specialties;

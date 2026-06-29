"use client";

import React from "react";
import { toast } from "sonner";
import { Prescription } from "@/types";
import { FileSpreadsheet } from "lucide-react";

interface PatientPrescriptionsProps {
  patientPrescriptions: Prescription[];
}

export function PatientPrescriptions({
  patientPrescriptions,
}: PatientPrescriptionsProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-6 shadow-xs animate-fadeIn space-y-6">
      <div className="pb-4 border-b border-slate-100 dark:border-slate-850">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Clinical Prescriptions</h2>
        <p className="text-xs text-slate-400 mt-1">Review prescriptions written by consulting specialists during past completed consultations.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-850 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-4 px-4">Doctor Name</th>
              <th className="py-4 px-4">Date Issued</th>
              <th className="py-4 px-4">Instructions Summary</th>
              <th className="py-4 px-4">Follow-Up Date</th>
              <th className="py-4 px-4 text-right">Download</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
            {patientPrescriptions.length > 0 ? (
              patientPrescriptions.map((pres) => (
                <tr key={pres.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                  <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">{pres.doctor.name}</td>
                  <td className="py-4 px-4 text-slate-500">
                    {new Date(pres.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="py-4 px-4 max-w-xs truncate text-slate-600 dark:text-slate-350">{pres.instructions}</td>
                  <td className="py-4 px-4 text-slate-500 font-semibold">{pres.followUpDate}</td>
                  <td className="py-4 px-4 text-right">
                    <a
                      href="#"
                      onClick={(e) => { e.preventDefault(); toast.info("Simulating prescription PDF download..."); }}
                      className="inline-flex items-center gap-1.5 text-primary hover:underline font-bold"
                    >
                      <FileSpreadsheet className="h-4 w-4" />
                      PDF
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-12 text-slate-400 font-medium">
                  No prescriptions submitted by consulting staff.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

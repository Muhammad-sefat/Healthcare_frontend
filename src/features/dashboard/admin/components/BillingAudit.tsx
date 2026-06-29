"use client";

import React from "react";
import { Appointment, AppointmentStatus, PaymentStatus } from "@/types";

interface BillingAuditProps {
  appointments: Appointment[];
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
}

export function BillingAudit({
  appointments,
  updateAppointmentStatus,
}: BillingAuditProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-6 shadow-xs animate-fadeIn space-y-6">
      <div className="pb-4 border-b border-slate-100 dark:border-slate-850">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Clinic Appointment & Billing Auditing</h2>
        <p className="text-xs text-slate-400 mt-1">Audit billing transactions, verify payment transaction IDs, and update appointment states manually.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-855 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-4 px-4">Patient Name</th>
              <th className="py-4 px-4">Doctor Name</th>
              <th className="py-4 px-4">Stripe Txn ID</th>
              <th className="py-4 px-4 text-center">Fare Amount</th>
              <th className="py-4 px-4 text-center">Billing</th>
              <th className="py-4 px-4 text-center">Visit Status</th>
              <th className="py-4 px-4 text-right">Manage Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-855/50">
            {appointments.map(appt => (
              <tr key={appt.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">{appt.patient.name}</td>
                <td className="py-4 px-4 text-slate-500">{appt.doctor.name}</td>
                <td className="py-4 px-4 font-mono text-[10px] text-slate-400">{appt.payment?.transactionId || "N/A"}</td>
                <td className="py-4 px-4 text-center font-bold text-slate-800 dark:text-slate-200">৳{appt.doctor.appointmentFee}</td>
                <td className="py-4 px-4 text-center">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider ${
                    appt.paymentStatus === PaymentStatus.PAID ? "bg-green-100 text-green-700 dark:bg-green-950/20 dark:text-green-450" : "bg-amber-100 text-amber-700 dark:bg-amber-955/20 dark:text-amber-450"
                  }`}>
                    {appt.paymentStatus}
                  </span>
                </td>
                <td className="py-4 px-4 text-center">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider ${
                    appt.status === AppointmentStatus.COMPLETED ? "bg-slate-100 text-slate-650 dark:bg-slate-800 dark:text-slate-400" :
                    appt.status === AppointmentStatus.CANCELED ? "bg-red-100 text-red-750 dark:bg-red-955/20 dark:text-red-400" :
                    "bg-blue-100 text-blue-700 dark:bg-blue-955/20 dark:text-blue-400"
                  }`}>
                    {appt.status}
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  <select
                    value={appt.status}
                    onChange={(e) => updateAppointmentStatus(appt.id, e.target.value as AppointmentStatus)}
                    className="bg-slate-50 dark:bg-slate-850 dark:text-white px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold cursor-pointer"
                  >
                    {Object.values(AppointmentStatus).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { 
  Appointment, 
  AppointmentStatus,
  PaymentStatus,
} from "@/types";

interface PatientAppointmentsProps {
  patientAppointments: Appointment[];
  handleTriggerVideoCall: (appt: Appointment) => void;
  initiatePayment: (id: string) => void;
  cancelAppointment: (id: string) => void;
  triggerReviewModal: (id: string) => void;
}

export function PatientAppointments({
  patientAppointments,
  handleTriggerVideoCall,
  initiatePayment,
  cancelAppointment,
  triggerReviewModal,
}: PatientAppointmentsProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-6 shadow-xs animate-fadeIn space-y-6">
      <div className="pb-4 border-b border-slate-100 dark:border-slate-850">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">My Appointments Archives</h2>
        <p className="text-xs text-slate-400 mt-1">Review appointment logs, initiate due payments, launch consultation calls, or submit rating reviews.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-850 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-4 px-4">Doctor Name</th>
              <th className="py-4 px-4">Consultation Slot</th>
              <th className="py-4 px-4 text-center">Fares</th>
              <th className="py-4 px-4 text-center">Payment</th>
              <th className="py-4 px-4 text-center">Status</th>
              <th className="py-4 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
            {patientAppointments.length > 0 ? (
              patientAppointments.map((appt) => (
                <tr key={appt.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                  <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">{appt.doctor.name}</td>
                  <td className="py-4 px-4 text-slate-500">
                    {new Date(appt.schedule.startDateTime).toLocaleDateString("en-US", { month: "short", day: "numeric" })} &bull;{" "}
                    {new Date(appt.schedule.startDateTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td className="py-4 px-4 text-center font-semibold text-slate-800 dark:text-slate-200">৳{appt.doctor.appointmentFee}</td>
                  <td className="py-4 px-4 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded-sm font-bold text-[9px] uppercase tracking-wider ${appt.paymentStatus === PaymentStatus.PAID ? "bg-green-50 text-green-600 dark:bg-green-950/20 dark:text-green-400" : "bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400"}`}>
                      {appt.paymentStatus}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded-sm font-bold text-[9px] uppercase tracking-wider ${
                      appt.status === AppointmentStatus.COMPLETED ? "bg-slate-100 text-slate-650 dark:bg-slate-800 dark:text-slate-400" :
                      appt.status === AppointmentStatus.CANCELED ? "bg-red-50 text-red-650 dark:bg-red-955/20 dark:text-red-400" :
                      "bg-blue-50 text-blue-600 dark:bg-blue-955/20 dark:text-blue-400"
                    }`}>
                      {appt.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex justify-end gap-2 text-xs">
                      {appt.status === AppointmentStatus.SCHEDULED && (
                        <button
                          onClick={() => handleTriggerVideoCall(appt)}
                          className="bg-primary hover:bg-primary/95 text-white px-3 py-1.5 rounded-lg font-bold shadow-sm cursor-pointer"
                        >
                          Call
                        </button>
                      )}
                      {appt.paymentStatus === PaymentStatus.UNPAID && appt.status !== AppointmentStatus.CANCELED && (
                        <button
                          onClick={() => initiatePayment(appt.id)}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg font-bold shadow-sm cursor-pointer"
                        >
                          Pay
                        </button>
                      )}
                      {appt.status === AppointmentStatus.SCHEDULED && (
                        <button
                          onClick={() => cancelAppointment(appt.id)}
                          className="border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 px-3 py-1.5 rounded-lg font-bold cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                      {appt.status === AppointmentStatus.COMPLETED && (
                        <button
                          onClick={() => triggerReviewModal(appt.id)}
                          className="bg-amber-400 hover:bg-amber-500 text-slate-900 px-3 py-1.5 rounded-lg font-bold shadow-sm cursor-pointer"
                        >
                          Review
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-12 text-slate-400 font-medium">
                  No appointments registered in history log.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

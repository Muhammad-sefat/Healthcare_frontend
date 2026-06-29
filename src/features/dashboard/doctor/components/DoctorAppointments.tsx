"use client";

import React from "react";
import { Appointment, AppointmentStatus, PaymentStatus } from "@/types";

interface DoctorAppointmentsProps {
  doctorAppointments: Appointment[];
  handleTriggerVideoCall: (appt: Appointment) => void;
  triggerPrescriptionModal: (apptId: string) => void;
  cancelAppointment: (id: string) => void;
  triggerPatientRecordModal: (email: string) => void;
}

export function DoctorAppointments({
  doctorAppointments,
  handleTriggerVideoCall,
  triggerPrescriptionModal,
  cancelAppointment,
  triggerPatientRecordModal,
}: DoctorAppointmentsProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-6 shadow-xs animate-fadeIn space-y-6">
      <div className="pb-4 border-b border-slate-100 dark:border-slate-850">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Appointments & Patients Directory</h2>
        <p className="text-xs text-slate-400 mt-1">Review scheduled patient appointments, start video panel consultations, or click names to review records.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-855 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-4 px-4">Patient Name</th>
              <th className="py-4 px-4">Demographics</th>
              <th className="py-4 px-4">Date & Time</th>
              <th className="py-4 px-4 text-center">Payment</th>
              <th className="py-4 px-4 text-center">Status</th>
              <th className="py-4 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-855/50">
            {doctorAppointments.length > 0 ? (
              doctorAppointments.map((appt) => (
                <tr key={appt.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                  <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">
                    <button
                      type="button"
                      onClick={() => triggerPatientRecordModal(appt.patient.email)}
                      className="hover:underline hover:text-primary font-bold cursor-pointer text-left"
                    >
                      {appt.patient.name}
                    </button>
                  </td>
                  <td className="py-4 px-4 text-slate-550">{appt.patient.email}</td>
                  <td className="py-4 px-4 text-slate-550">
                    {new Date(appt.schedule.startDateTime).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                  </td>
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
                    <div className="flex justify-end gap-2">
                      {appt.status === AppointmentStatus.SCHEDULED && (
                        <button
                          type="button"
                          onClick={() => handleTriggerVideoCall(appt)}
                          className="bg-primary hover:bg-primary/95 text-white px-3 py-1.5 rounded-lg font-bold shadow-sm cursor-pointer"
                        >
                          Consult
                        </button>
                      )}
                      {appt.status === AppointmentStatus.INPROGRESS && (
                        <button
                          type="button"
                          onClick={() => triggerPrescriptionModal(appt.id)}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg font-bold shadow-sm cursor-pointer"
                        >
                          Prescribe
                        </button>
                      )}
                      {appt.status === AppointmentStatus.SCHEDULED && (
                        <button
                          type="button"
                          onClick={() => cancelAppointment(appt.id)}
                          className="border border-slate-200 dark:border-slate-800 text-slate-500 px-3 py-1.5 rounded-lg font-bold hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-12 text-slate-400 font-medium">
                  No patient appointments in database logs.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

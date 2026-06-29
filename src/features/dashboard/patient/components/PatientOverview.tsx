"use client";

import React from "react";
import Link from "next/link";
import { 
  Appointment, 
  Review,
  AppointmentStatus,
  PaymentStatus,
} from "@/types";
import { 
  Calendar, 
  UserCheck2, 
  Star, 
  Video, 
  CreditCard,
} from "lucide-react";

interface PatientOverviewProps {
  patientAppointments: Appointment[];
  patientReviews: Review[];
  handleTriggerVideoCall: (appt: Appointment) => void;
  initiatePayment: (id: string) => void;
}

export function PatientOverview({
  patientAppointments,
  patientReviews,
  handleTriggerVideoCall,
  initiatePayment,
}: PatientOverviewProps) {
  const activeAppts = patientAppointments.filter(
    (a) => a.status === AppointmentStatus.SCHEDULED || a.status === AppointmentStatus.INPROGRESS
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top header stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-150 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-2xl text-primary"><Calendar className="h-6 w-6" /></div>
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Bookings</span>
            <span className="text-xl font-extrabold text-slate-900 dark:text-white">{patientAppointments.length}</span>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-150 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 rounded-2xl"><UserCheck2 className="h-6 w-6" /></div>
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pending Visits</span>
            <span className="text-xl font-extrabold text-slate-900 dark:text-white">{activeAppts.length}</span>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-150 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400 rounded-2xl"><Star className="h-6 w-6" /></div>
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">My Reviews</span>
            <span className="text-xl font-extrabold text-slate-900 dark:text-white">{patientReviews.length}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Status distribution chart */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-150 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-6 uppercase tracking-wider border-b border-slate-50 dark:border-slate-850 pb-2">
            Appointments Distribution
          </h3>
          
          <div className="flex-1 flex flex-col justify-center space-y-4 py-4">
            {["COMPLETED", "SCHEDULED", "CANCELED"].map(status => {
              const count = patientAppointments.filter(a => a.status === status).length;
              const total = patientAppointments.length || 1;
              const percent = Math.round((count / total) * 100);
              const colors = {
                COMPLETED: "bg-emerald-500",
                SCHEDULED: "bg-primary",
                CANCELED: "bg-rose-500"
              };
              return (
                <div key={status} className="space-y-1 text-xs">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-500">{status}</span>
                    <span className="text-slate-800 dark:text-slate-200">{count} ({percent}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${colors[status as keyof typeof colors]}`} 
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions / Active Appointment list */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-150 dark:border-slate-800 shadow-xs">
          <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-4 uppercase tracking-wider border-b border-slate-50 dark:border-slate-850 pb-2">
            Upcoming Consultation Panel
          </h3>

          {activeAppts.length > 0 ? (
            <div className="space-y-4">
              {activeAppts.slice(0, 2).map((appt) => (
                <div key={appt.id} className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                  <div>
                    <span className="block font-bold text-slate-900 dark:text-white text-sm">{appt.doctor.name}</span>
                    <span className="block text-slate-400 font-medium mt-0.5">
                      {new Date(appt.schedule.startDateTime).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                    </span>
                    <div className="flex gap-2 mt-2">
                      <span className={`px-2 py-0.5 rounded-sm font-bold text-[9px] uppercase tracking-wider ${appt.paymentStatus === PaymentStatus.PAID ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                        {appt.paymentStatus}
                      </span>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-sm font-bold text-[9px] uppercase tracking-wider">
                        {appt.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {appt.status === AppointmentStatus.SCHEDULED && (
                      <button
                        onClick={() => handleTriggerVideoCall(appt)}
                        className="bg-primary hover:bg-primary/95 text-white px-4 py-2.5 rounded-xl font-bold shadow-md shadow-primary/10 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Video className="h-4 w-4" />
                        Join Video
                      </button>
                    )}
                    {appt.paymentStatus === PaymentStatus.UNPAID && (
                      <button
                        onClick={() => initiatePayment(appt.id)}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
                      >
                        <CreditCard className="h-4 w-4" />
                        Settle Pay
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 space-y-4">
              <Calendar className="h-8 w-8 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-400 dark:text-slate-400">No scheduled consultations found.</p>
              <Link href="/dashboard/patient/book" className="inline-block bg-primary text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md">
                Book Consultation
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

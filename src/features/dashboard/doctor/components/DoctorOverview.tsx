"use client";

import React from "react";
import { 
  Appointment, 
  Review,
  AppointmentStatus,
  PaymentStatus,
} from "@/types";
import { 
  Calendar, 
  Users, 
  DollarSign, 
  Star, 
  Video, 
  UserCheck
} from "lucide-react";

interface DoctorOverviewProps {
  doctorAppointments: Appointment[];
  doctorReviews: Review[];
  handleTriggerVideoCall: (appt: Appointment) => void;
}

export function DoctorOverview({
  doctorAppointments,
  doctorReviews,
  handleTriggerVideoCall,
}: DoctorOverviewProps) {
  const paidAppts = doctorAppointments.filter(a => a.paymentStatus === PaymentStatus.PAID);
  const totalRevenue = paidAppts.reduce((sum, a) => sum + (a.doctor?.appointmentFee || 0), 0);
  const activeAppts = doctorAppointments.filter(a => a.status === AppointmentStatus.SCHEDULED);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-150 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-2xl text-primary"><Calendar className="h-6 w-6" /></div>
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Bookings</span>
            <span className="text-xl font-extrabold text-slate-900 dark:text-white">{doctorAppointments.length}</span>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-150 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 rounded-2xl"><Users className="h-6 w-6" /></div>
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Patients</span>
            <span className="text-xl font-extrabold text-slate-900 dark:text-white">
              {new Set(doctorAppointments.map(a => a.patientId)).size}
            </span>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-150 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-purple-100 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400 rounded-2xl"><DollarSign className="h-6 w-6" /></div>
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">PAID Revenue</span>
            <span className="text-xl font-extrabold text-slate-900 dark:text-white">৳{totalRevenue}</span>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-150 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400 rounded-2xl"><Star className="h-6 w-6" /></div>
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Reviews Feed</span>
            <span className="text-xl font-extrabold text-slate-900 dark:text-white">{doctorReviews.length}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Status distribution */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-150 dark:border-slate-800 shadow-xs">
          <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-6 uppercase tracking-wider border-b border-slate-50 dark:border-slate-850 pb-2">
            Consultation Status
          </h3>
          <div className="space-y-4 py-4">
            {["COMPLETED", "SCHEDULED", "CANCELED"].map(status => {
              const count = doctorAppointments.filter(a => a.status === status).length;
              const total = doctorAppointments.length || 1;
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

        {/* Quick Consultation shortcuts */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-150 dark:border-slate-800 shadow-xs">
          <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-4 uppercase tracking-wider border-b border-slate-50 dark:border-slate-850 pb-2">
            Active Consultations Panel
          </h3>

          {activeAppts.length > 0 ? (
            <div className="space-y-4">
              {activeAppts.slice(0, 2).map((appt) => (
                <div key={appt.id} className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-100 dark:border-slate-850 flex justify-between items-center text-xs">
                  <div>
                    <span className="block font-bold text-slate-900 dark:text-white text-sm">{appt.patient.name}</span>
                    <span className="block text-slate-400 font-medium mt-0.5">
                      Slot: {new Date(appt.schedule.startDateTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <button
                    onClick={() => handleTriggerVideoCall(appt)}
                    className="bg-primary hover:bg-primary/95 text-white px-4 py-2.5 rounded-xl font-bold shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <Video className="h-4 w-4" />
                    Start Consult
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-450 dark:text-slate-500 space-y-2 text-xs">
              <UserCheck className="h-8 w-8 text-slate-300 mx-auto" />
              <p>No pending consultations for today.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { toast } from "sonner";
import { 
  Appointment, 
  Doctor, 
  Schedule,
  AppointmentStatus,
  PaymentStatus,
  Review,
  Prescription
} from "@/types";
import { 
  Calendar, 
  Users, 
  DollarSign, 
  Star, 
  Video, 
  UserCheck
} from "lucide-react";

interface DoctorDashboardProps {
  activeTab: string;
  doctorAppointments: Appointment[];
  doctorReviews: Review[];
  doctorPrescriptions: Prescription[];
  schedules: Schedule[];
  currentProfile: Doctor | null;
  handleTriggerVideoCall: (appt: Appointment) => void;
  triggerPrescriptionModal: (apptId: string) => void;
  cancelAppointment: (id: string) => void;
  releaseSlot: (id: string) => void;
  claimSlot: (id: string) => void;
  triggerPatientRecordModal: (email: string) => void;
}

export function DoctorDashboard({
  activeTab,
  doctorAppointments,
  doctorReviews,
  doctorPrescriptions,
  schedules,
  currentProfile,
  handleTriggerVideoCall,
  triggerPrescriptionModal,
  cancelAppointment,
  releaseSlot,
  claimSlot,
  triggerPatientRecordModal,
}: DoctorDashboardProps) {
  // Mock doctor schedules links
  const mockDoctorSchedules = [
    { id: "doc-sched-1", doctorId: "doc-uuid-1", scheduleId: "sched-uuid-1", isBooked: true },
    { id: "doc-sched-2", doctorId: "doc-uuid-1", scheduleId: "sched-uuid-2", isBooked: false },
    { id: "doc-sched-3", doctorId: "doc-uuid-1", scheduleId: "sched-uuid-3", isBooked: false },
    { id: "doc-sched-4", doctorId: "doc-uuid-1", scheduleId: "sched-uuid-4", isBooked: false },
    { id: "doc-sched-5", doctorId: "doc-uuid-2", scheduleId: "sched-uuid-5", isBooked: false },
    { id: "doc-sched-6", doctorId: "doc-uuid-2", scheduleId: "sched-uuid-6", isBooked: false },
    { id: "doc-sched-7", doctorId: "doc-uuid-2", scheduleId: "sched-uuid-7", isBooked: false }
  ];

  if (activeTab === "overview") {
    const paidAppts = doctorAppointments.filter(a => a.paymentStatus === PaymentStatus.PAID);
    const totalRevenue = paidAppts.reduce((sum, a) => sum + a.doctor.appointmentFee, 0);
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
            <div className="p-3 bg-amber-100 text-amber-600 dark:bg-amber-950/20 dark:text-amber-405 rounded-2xl"><Star className="h-6 w-6" /></div>
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

            {doctorAppointments.filter(a => a.status === AppointmentStatus.SCHEDULED).length > 0 ? (
              <div className="space-y-4">
                {doctorAppointments.filter(a => a.status === AppointmentStatus.SCHEDULED).slice(0, 2).map((appt) => (
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

  if (activeTab === "slots") {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-6 shadow-xs animate-fadeIn space-y-6">
        <div className="pb-4 border-b border-slate-100 dark:border-slate-850">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">My Claims Schedule Slots</h2>
          <p className="text-xs text-slate-450 dark:text-slate-400 mt-1">Claim general clinic schedule intervals so patients can discover and book consultations. release unbooked claimed slots.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {schedules.map((slot) => {
            // Check if claimed by this doctor
            const link = mockDoctorSchedules.find(ds => ds.scheduleId === slot.id && ds.doctorId === currentProfile?.id);
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

  if (activeTab === "doctor-appointments") {
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
                        onClick={() => triggerPatientRecordModal(appt.patient.email)}
                        className="hover:underline hover:text-primary font-bold cursor-pointer"
                      >
                        {appt.patient.name}
                      </button>
                    </td>
                    <td className="py-4 px-4 text-slate-500">{appt.patient.email}</td>
                    <td className="py-4 px-4 text-slate-500">
                      {new Date(appt.schedule.startDateTime).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-sm font-bold text-[9px] uppercase tracking-wider ${appt.paymentStatus === PaymentStatus.PAID ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"}`}>
                        {appt.paymentStatus}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-sm font-bold text-[9px] uppercase tracking-wider ${
                        appt.status === AppointmentStatus.COMPLETED ? "bg-slate-100 text-slate-650" :
                        appt.status === AppointmentStatus.CANCELED ? "bg-red-50 text-red-650" :
                        "bg-blue-50 text-blue-600"
                      }`}>
                        {appt.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        {appt.status === AppointmentStatus.SCHEDULED && (
                          <button
                            onClick={() => handleTriggerVideoCall(appt)}
                            className="bg-primary hover:bg-primary/95 text-white px-3 py-1.5 rounded-lg font-bold shadow-sm cursor-pointer"
                          >
                            Consult
                          </button>
                        )}
                        {appt.status === AppointmentStatus.INPROGRESS && (
                          <button
                            onClick={() => triggerPrescriptionModal(appt.id)}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg font-bold shadow-sm cursor-pointer"
                          >
                            Prescribe
                          </button>
                        )}
                        {appt.status === AppointmentStatus.SCHEDULED && (
                          <button
                            onClick={() => cancelAppointment(appt.id)}
                            className="border border-slate-200 dark:border-slate-800 text-slate-500 px-3 py-1.5 rounded-lg font-bold hover:bg-slate-50 cursor-pointer"
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

  if (activeTab === "doctor-prescriptions") {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-6 shadow-xs animate-fadeIn space-y-6">
        <div className="pb-4 border-b border-slate-100 dark:border-slate-850">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Written Prescriptions logs</h2>
          <p className="text-xs text-slate-450 dark:text-slate-400 mt-1">Historical list of medical prescriptions issued by you for your patients.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-855 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-4 px-4">Patient</th>
                <th className="py-4 px-4">Date Prescribed</th>
                <th className="py-4 px-4">Instructions Detail</th>
                <th className="py-4 px-4">Follow-Up Date</th>
                <th className="py-4 px-4 text-right">PDF Guide</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-855/50">
              {doctorPrescriptions.length > 0 ? (
                doctorPrescriptions.map((pres) => (
                  <tr key={pres.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                    <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">{pres.patient.name}</td>
                    <td className="py-4 px-4 text-slate-500">
                      {new Date(pres.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="py-4 px-4 max-w-xs truncate text-slate-600 dark:text-slate-350">{pres.instructions}</td>
                    <td className="py-4 px-4 text-slate-550 font-semibold">{pres.followUpDate}</td>
                    <td className="py-4 px-4 text-right">
                      <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); toast.info("Simulating PDF download..."); }}
                        className="text-primary hover:underline font-bold"
                      >
                        Download
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400 font-medium">
                    No prescriptions written yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (activeTab === "doctor-reviews") {
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
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-500" />
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

  return null;
}

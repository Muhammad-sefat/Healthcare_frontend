"use client";

import React from "react";
import Link from "next/link";
import { 
  Appointment, 
  Patient, 
  Gender, 
  BloodGroup,
  AppointmentStatus,
  PaymentStatus,
  Review,
  Prescription
} from "@/types";
import { 
  Calendar, 
  UserCheck2, 
  Star, 
  Video, 
  CreditCard,
  FileSpreadsheet,
  FileText,
  Trash2,
  Plus
} from "lucide-react";

interface PatientDashboardProps {
  activeTab: string;
  currentProfile: Patient | null;
  patientAppointments: Appointment[];
  patientReviews: Review[];
  patientPrescriptions: Prescription[];
  patName: string;
  setPatName: (v: string) => void;
  patPhone: string;
  setPatPhone: (v: string) => void;
  patAddress: string;
  setPatAddress: (v: string) => void;
  patGender: Gender;
  setPatGender: (v: Gender) => void;
  patBlood: BloodGroup;
  setPatBlood: (v: BloodGroup) => void;
  patDob: string;
  setPatDob: (v: string) => void;
  patHeight: string;
  setPatHeight: (v: string) => void;
  patWeight: string;
  setPatWeight: (v: string) => void;
  patAllergies: boolean;
  setPatAllergies: (v: boolean) => void;
  patDiabetes: boolean;
  setPatDiabetes: (v: boolean) => void;
  patSmoking: boolean;
  setPatSmoking: (v: boolean) => void;
  patDiet: string;
  setPatDiet: (v: string) => void;
  patMarital: string;
  setPatMarital: (v: string) => void;
  patHistory: string;
  setPatHistory: (v: string) => void;
  reportFileName: string;
  setReportFileName: (v: string) => void;
  
  handleProfileSave: (e: React.FormEvent) => void;
  handleReportUploadSubmit: (e: React.FormEvent) => void;
  deleteMedicalReport: (id: string) => void;
  handleTriggerVideoCall: (appt: Appointment) => void;
  initiatePayment: (id: string) => void;
  cancelAppointment: (id: string) => void;
  triggerReviewModal: (id: string) => void;
}

export function PatientDashboard({
  activeTab,
  currentProfile,
  patientAppointments,
  patientReviews,
  patientPrescriptions,
  patName,
  setPatName,
  patPhone,
  setPatPhone,
  patAddress,
  setPatAddress,
  patGender,
  setPatGender,
  patBlood,
  setPatBlood,
  patDob,
  setPatDob,
  patHeight,
  setPatHeight,
  patWeight,
  setPatWeight,
  patAllergies,
  setPatAllergies,
  patDiabetes,
  setPatDiabetes,
  patSmoking,
  setPatSmoking,
  patDiet,
  setPatDiet,
  patMarital,
  setPatMarital,
  patHistory,
  setPatHistory,
  reportFileName,
  setReportFileName,
  handleProfileSave,
  handleReportUploadSubmit,
  deleteMedicalReport,
  handleTriggerVideoCall,
  initiatePayment,
  cancelAppointment,
  triggerReviewModal,
}: PatientDashboardProps) {
  if (activeTab === "overview") {
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
            <div className="p-3 bg-amber-100 text-amber-600 dark:bg-amber-950/20 dark:text-amber-405 rounded-2xl"><Star className="h-6 w-6" /></div>
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
                <p className="text-xs text-slate-450 dark:text-slate-400">No scheduled consultations found.</p>
                <Link href="/doctors" className="inline-block bg-primary text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md">
                  Find a Doctor
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === "appointments") {
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
            <tbody className="divide-y divide-slate-50 dark:divide-slate-855/50">
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
                      <span className={`inline-block px-2 py-0.5 rounded-sm font-bold text-[9px] uppercase tracking-wider ${appt.paymentStatus === PaymentStatus.PAID ? "bg-green-50 text-green-600 dark:bg-green-950/20 dark:text-green-400" : "bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-404"}`}>
                        {appt.paymentStatus}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-sm font-bold text-[9px] uppercase tracking-wider ${
                        appt.status === AppointmentStatus.COMPLETED ? "bg-slate-100 text-slate-650 dark:bg-slate-805 dark:text-slate-404" :
                        appt.status === AppointmentStatus.CANCELED ? "bg-red-50 text-red-650 dark:bg-red-955/20 dark:text-red-404" :
                        "bg-blue-50 text-blue-600 dark:bg-blue-955/20 dark:text-blue-404"
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
                            className="bg-amber-400 hover:bg-amber-505 text-slate-900 px-3 py-1.5 rounded-lg font-bold shadow-sm cursor-pointer"
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

  if (activeTab === "prescriptions") {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-6 shadow-xs animate-fadeIn space-y-6">
        <div className="pb-4 border-b border-slate-100 dark:border-slate-850">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Clinical Prescriptions</h2>
          <p className="text-xs text-slate-400 mt-1">Review prescriptions written by consulting specialists during past completed consultations.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-855 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-4 px-4">Doctor Name</th>
                <th className="py-4 px-4">Date Issued</th>
                <th className="py-4 px-4">Instructions Summary</th>
                <th className="py-4 px-4">Follow-Up Date</th>
                <th className="py-4 px-4 text-right">Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-855/50">
              {patientPrescriptions.length > 0 ? (
                patientPrescriptions.map((pres) => (
                  <tr key={pres.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                    <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">{pres.doctor.name}</td>
                    <td className="py-4 px-4 text-slate-500">
                      {new Date(pres.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="py-4 px-4 max-w-xs truncate text-slate-650 dark:text-slate-350">{pres.instructions}</td>
                    <td className="py-4 px-4 text-slate-550 font-semibold">{pres.followUpDate}</td>
                    <td className="py-4 px-4 text-right">
                      <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); alert("Simulating prescription PDF download..."); }}
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

  if (activeTab === "profile") {
    const p = currentProfile;
    if (!p) return null;
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
        {/* Left Panel: Profile settings */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
          <form onSubmit={handleProfileSave} className="space-y-6">
            <h2 className="text-lg font-bold text-slate-955 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-850">
              Personal & Medical Profile
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  required
                  value={patName}
                  onChange={(e) => setPatName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-hidden focus:border-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contact Number</label>
                <input
                  type="text"
                  value={patPhone}
                  onChange={(e) => setPatPhone(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-hidden focus:border-primary"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mailing Address</label>
              <input
                type="text"
                value={patAddress}
                onChange={(e) => setPatAddress(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-hidden focus:border-primary"
              />
            </div>

            <hr className="border-slate-50 dark:border-slate-850" />
            <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider">Health Data Details</h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="space-y-1">
                <label className="block text-[9px] font-bold text-slate-400 uppercase">Gender</label>
                <select
                  value={patGender}
                  onChange={(e) => setPatGender(e.target.value as Gender)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 text-xs appearance-none"
                >
                  <option value={Gender.MALE}>Male</option>
                  <option value={Gender.FEMALE}>Female</option>
                  <option value={Gender.OTHER}>Other</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[9px] font-bold text-slate-400 uppercase">Blood Group</label>
                <select
                  value={patBlood}
                  onChange={(e) => setPatBlood(e.target.value as BloodGroup)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 text-xs"
                >
                  {Object.values(BloodGroup).map(bg => (
                    <option key={bg} value={bg}>{bg.replace("_", " ")}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[9px] font-bold text-slate-400 uppercase">Date of Birth</label>
                <input
                  type="date"
                  value={patDob}
                  onChange={(e) => setPatDob(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[9px] font-bold text-slate-400 uppercase">Marital Status</label>
                <select
                  value={patMarital}
                  onChange={(e) => setPatMarital(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 text-xs"
                >
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="block text-[9px] font-bold text-slate-400 uppercase">Height (cm/ft)</label>
                <input
                  type="text"
                  value={patHeight}
                  onChange={(e) => setPatHeight(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 text-xs"
                  placeholder="5 feet 9 inches"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[9px] font-bold text-slate-400 uppercase">Weight (kg)</label>
                <input
                  type="text"
                  value={patWeight}
                  onChange={(e) => setPatWeight(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 text-xs"
                  placeholder="75 kg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs py-2 bg-slate-50/50 dark:bg-slate-850/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-850">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="patAllergies"
                  checked={patAllergies}
                  onChange={(e) => setPatAllergies(e.target.checked)}
                  className="h-4 w-4 text-primary rounded-sm border-slate-350"
                />
                <label htmlFor="patAllergies" className="font-semibold text-slate-605 dark:text-slate-400 cursor-pointer">Has Allergies</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="patDiabetes"
                  checked={patDiabetes}
                  onChange={(e) => setPatDiabetes(e.target.checked)}
                  className="h-4 w-4 text-primary rounded-sm border-slate-350"
                />
                <label htmlFor="patDiabetes" className="font-semibold text-slate-605 dark:text-slate-400 cursor-pointer">Has Diabetes</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="patSmoking"
                  checked={patSmoking}
                  onChange={(e) => setPatSmoking(e.target.checked)}
                  className="h-4 w-4 text-primary rounded-sm border-slate-350"
                />
                <label htmlFor="patSmoking" className="font-semibold text-slate-605 dark:text-slate-400 cursor-pointer">Smoking Status</label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="block text-[9px] font-bold text-slate-400 uppercase">Dietary Preferences</label>
                <input
                  type="text"
                  value={patDiet}
                  onChange={(e) => setPatDiet(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 text-xs"
                  placeholder="Vegetarian / None"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[9px] font-bold text-slate-400 uppercase">Mental Health notes</label>
                <input
                  type="text"
                  value={patHistory}
                  onChange={(e) => setPatHistory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 text-xs"
                  placeholder="Anxiety / None"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-primary hover:bg-primary/95 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all duration-200"
            >
              Save Health Profile
            </button>
          </form>
        </div>

        {/* Right Panel: Medical records uploader */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Medical Reports Vault</h3>
            <p className="text-[11px] text-slate-400 mt-1">Upload relevant blood profiles or radiology report PDFs (maximum 5 files).</p>
          </div>

          {/* Reports List */}
          <div className="space-y-3">
            {p.medicalReports && p.medicalReports.length > 0 ? (
              p.medicalReports.map(rep => (
                <div key={rep.id} className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2 truncate pr-2">
                    <FileText className="h-4 w-4 text-slate-400 flex-shrink-0" />
                    <span className="font-bold text-slate-700 dark:text-slate-350 truncate">{rep.reportName}</span>
                  </div>
                  <button
                    onClick={() => deleteMedicalReport(rep.id)}
                    className="p-1 hover:bg-red-50 text-red-500 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-slate-400 text-xs border border-dashed border-slate-200 dark:border-slate-850 rounded-xl">
                No files uploaded.
              </div>
            )}
          </div>

          {/* Uploader Form */}
          {(!p.medicalReports || p.medicalReports.length < 5) ? (
            <form onSubmit={handleReportUploadSubmit} className="space-y-3 pt-4 border-t border-slate-50 dark:border-slate-850">
              <input
                type="text"
                required
                value={reportFileName}
                onChange={(e) => setReportFileName(e.target.value)}
                placeholder="CBC_Blood_Report.pdf"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-705 rounded-xl text-xs focus:outline-hidden"
              />
              <button
                type="submit"
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-750 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="h-4 w-4" />
                Add Report File
              </button>
            </form>
          ) : (
            <div className="bg-amber-50 dark:bg-amber-955/20 text-amber-600 p-3 rounded-xl border border-amber-100 text-xs">
              Uploader limit reached (5 files max).
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}

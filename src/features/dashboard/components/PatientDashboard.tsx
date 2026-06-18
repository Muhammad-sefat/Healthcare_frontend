"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { DatePicker } from "@/components/ui/date-picker";
import { 
  Appointment, 
  Patient, 
  Gender, 
  BloodGroup,
  AppointmentStatus,
  PaymentStatus,
  Review,
  Prescription,
  Doctor,
  Specialty,
  Schedule
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
  Plus,
  Search,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X
} from "lucide-react";
import { mockDoctorSchedules } from "@/constants/mockData";
import { CustomModal } from "@/components/ui/custom-modal";

interface PatientDashboardProps {
  activeTab: string;
  currentProfile: Patient | null;
  patientAppointments: Appointment[];
  patientReviews: Review[];
  patientPrescriptions: Prescription[];
  doctors: Doctor[];
  specialties: Specialty[];
  schedules: Schedule[];
  bookAppointment: (doctorId: string, scheduleId: string, payNow: boolean) => void;
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
  doctors,
  specialties,
  schedules,
  bookAppointment,
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
  // Booking Tab Local States
  const [bookSearch, setBookSearch] = useState("");
  const [bookSpec, setBookSpec] = useState("");
  const [selectedDocForBooking, setSelectedDocForBooking] = useState<Doctor | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [bookingPaymentModalOpen, setBookingPaymentModalOpen] = useState(false);
  const [bookingSuccessModalOpen, setBookingSuccessModalOpen] = useState(false);
  const [paymentOption, setPaymentOption] = useState<"pay_now" | "pay_later">("pay_now");

  // stripe mock inputs
  const [cardNumberVal, setCardNumberVal] = useState("4242 4242 4242 4242");
  const [expiryVal, setExpiryVal] = useState("12/28");
  const [cvcVal, setCvcVal] = useState("987");
  const [bookingLoading, setBookingLoading] = useState(false);

  // Filter doctors for the dashboard booking tab
  const bookingFilteredDoctors = useMemo(() => {
    return doctors.filter(doc => {
      if (doc.isDeleted) return false;
      const matchesSearch = doc.name.toLowerCase().includes(bookSearch.toLowerCase()) || 
                            doc.qualification.toLowerCase().includes(bookSearch.toLowerCase());
      const matchesSpecialty = !bookSpec || doc.specialties.some(s => s.specialtyId === bookSpec);
      return matchesSearch && matchesSpecialty;
    });
  }, [doctors, bookSearch, bookSpec]);

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

  if (activeTab === "book") {
    // Group slots by Date for the selected doctor
    const docClaimedSlots = selectedDocForBooking 
      ? schedules.filter(s => {
          const link = mockDoctorSchedules.find(ds => ds.scheduleId === s.id && ds.doctorId === selectedDocForBooking.id);
          return link && !s.isBooked;
        })
      : [];

    const groupedSlots: { [key: string]: Schedule[] } = {};
    docClaimedSlots.forEach((slot) => {
      const dateKey = new Date(slot.startDateTime).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
      if (!groupedSlots[dateKey]) groupedSlots[dateKey] = [];
      groupedSlots[dateKey].push(slot);
    });

    const handleConfirmBookingSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedDocForBooking || !selectedSlotId) return;

      if (paymentOption === "pay_now") {
        setBookingLoading(true);
        setTimeout(() => {
          bookAppointment(selectedDocForBooking.id, selectedSlotId, true);
          setBookingLoading(false);
          setBookingPaymentModalOpen(false);
          setBookingSuccessModalOpen(true);
        }, 2000);
      } else {
        bookAppointment(selectedDocForBooking.id, selectedSlotId, false);
        setBookingSuccessModalOpen(true);
      }
    };

    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="pb-4 border-b border-slate-100 dark:border-slate-850">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Book Virtual Consultation</h2>
          <p className="text-xs text-slate-400 mt-1">Select a specialist and secure your appointment slot directly from the dashboard.</p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-4 top-3 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search doctors..."
              value={bookSearch}
              onChange={(e) => setBookSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-150 dark:border-slate-700 rounded-xl text-xs focus:outline-hidden focus:border-primary transition-colors dark:text-white"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <button
              onClick={() => setBookSpec("")}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                !bookSpec
                  ? "bg-primary text-white shadow-md shadow-primary/10"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-655 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              All Specialties
            </button>
            {specialties.map((spec) => (
              <button
                key={spec.id}
                onClick={() => setBookSpec(spec.id)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  bookSpec === spec.id
                    ? "bg-primary text-white shadow-md shadow-primary/10"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-655 dark:bg-slate-800 dark:text-slate-300"
              }`}
              >
                {spec.title}
              </button>
            ))}
          </div>
        </div>

        {/* Doctor Grid */}
        {bookingFilteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookingFilteredDoctors.map((doc) => (
              <div key={doc.id} className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
                <div className="space-y-4">
                  <div className="flex gap-3 items-center">
                    <img src={doc.profilePhoto} alt={doc.name} className="h-14 w-14 rounded-xl object-cover border" />
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{doc.name}</h4>
                      <span className="text-[10px] text-primary font-bold block mt-0.5">{doc.specialties[0]?.specialty?.title}</span>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-500 space-y-1">
                    <div className="flex gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      <span>{doc.experience} Years Exp</span>
                    </div>
                    <div className="flex gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      <span className="truncate">{doc.currentWorkplace}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-850 mt-5 pt-3">
                  <div>
                    <span className="block text-[8px] text-slate-400 uppercase tracking-wider font-semibold">Consult Fee</span>
                    <span className="text-sm font-extrabold text-primary">৳{doc.appointmentFee}</span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedDocForBooking(doc);
                      setSelectedSlotId(null);
                      setPaymentOption("pay_now");
                    }}
                    className="bg-primary hover:bg-primary/95 text-white px-4 py-2 rounded-xl text-[10px] font-bold shadow-xs cursor-pointer"
                  >
                    Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-slate-900 border rounded-3xl space-y-2">
            <Calendar className="h-8 w-8 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-400">No matching doctors found.</p>
          </div>
        )}

        {/* Selected Doctor Scheduling slots selector panel inside booking */}
        {selectedDocForBooking && (
          <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-850">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <Calendar className="h-4.5 w-4.5 text-primary" />
                Select Schedule Slot for {selectedDocForBooking.name}
              </h3>
              <button onClick={() => setSelectedDocForBooking(null)} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-50 rounded-lg cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            {docClaimedSlots.length > 0 ? (
              <div className="space-y-4">
                {Object.entries(groupedSlots).map(([dateLabel, slots]) => (
                  <div key={dateLabel} className="space-y-2">
                    <h5 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{dateLabel}</h5>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                      {slots.map((slot) => {
                        const isSel = selectedSlotId === slot.id;
                        const timeStr = new Date(slot.startDateTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
                        return (
                          <button
                            key={slot.id}
                            type="button"
                            onClick={() => setSelectedSlotId(slot.id)}
                            className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                              isSel
                                ? "bg-primary border-primary text-white shadow-md"
                                : "border-slate-200 hover:border-primary/50 text-slate-655 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                            }`}
                          >
                            {timeStr}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Booking Options selection buttons */}
                <div className="pt-6 border-t border-slate-100 dark:border-slate-850 space-y-4">
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setPaymentOption("pay_now")}
                      className={`flex-1 py-3 px-4 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        paymentOption === "pay_now"
                          ? "bg-primary/5 border-primary text-primary"
                          : "border-slate-200 text-slate-605 dark:border-slate-700 dark:text-slate-350"
                      }`}
                    >
                      Pay Now with Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentOption("pay_later")}
                      className={`flex-1 py-3 px-4 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        paymentOption === "pay_later"
                          ? "bg-primary/5 border-primary text-primary"
                          : "border-slate-200 text-slate-605 dark:border-slate-700 dark:text-slate-350"
                      }`}
                    >
                      Book & Pay Later
                    </button>
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setSelectedDocForBooking(null)}
                      className="px-5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-505 hover:bg-slate-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      disabled={!selectedSlotId}
                      onClick={(e) => {
                        if (paymentOption === "pay_now") {
                          setBookingPaymentModalOpen(true);
                        } else {
                          handleConfirmBookingSubmit(e);
                        }
                      }}
                      className="bg-primary hover:bg-primary/95 disabled:bg-slate-100 disabled:text-slate-400 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md cursor-pointer disabled:cursor-not-allowed"
                    >
                      Confirm Booking
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                <Calendar className="h-6 w-6 text-slate-300 mx-auto" />
                <h5 className="font-bold text-xs text-slate-700 dark:text-slate-250">No Slots Claimed</h5>
                <p className="text-[10px] text-slate-400">This specialist hasn't configured availability. Please select another specialist.</p>
              </div>
            )}
          </div>
        )}

        {/* Payment Modal simulation */}
        <CustomModal
          isOpen={bookingPaymentModalOpen}
          onClose={() => setBookingPaymentModalOpen(false)}
          title="Stripe Card Payment Checkout"
        >
          {selectedDocForBooking && (
            <form onSubmit={handleConfirmBookingSubmit} className="space-y-5">
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl flex justify-between text-xs text-slate-500">
                <div>
                  <span className="block font-bold">Doctor Consult:</span>
                  <span className="font-semibold text-slate-800 dark:text-white mt-0.5 block">{selectedDocForBooking.name}</span>
                </div>
                <div className="text-right">
                  <span className="block font-bold">Total Fare:</span>
                  <span className="text-primary font-extrabold text-sm mt-0.5 block">৳{selectedDocForBooking.appointmentFee}</span>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Card Number</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={cardNumberVal}
                      onChange={(e) => setCardNumberVal(e.target.value)}
                      className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-hidden focus:border-primary transition-colors dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Expiry Date</label>
                    <input
                      type="text"
                      required
                      value={expiryVal}
                      onChange={(e) => setExpiryVal(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-center dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">CVC Code</label>
                    <input
                      type="password"
                      required
                      value={cvcVal}
                      onChange={(e) => setCvcVal(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-center dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                <button type="button" onClick={() => setBookingPaymentModalOpen(false)} className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 hover:bg-slate-50 text-xs font-semibold cursor-pointer">Cancel</button>
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="bg-primary text-white hover:bg-primary/95 px-6 py-2.5 rounded-xl font-bold shadow-md text-xs flex items-center justify-center min-w-[120px] cursor-pointer"
                >
                  {bookingLoading ? "Settling..." : `Pay ৳${selectedDocForBooking.appointmentFee}`}
                </button>
              </div>
            </form>
          )}
        </CustomModal>

        {/* Success Modal Simulation */}
        <CustomModal
          isOpen={bookingSuccessModalOpen}
          onClose={() => setBookingSuccessModalOpen(false)}
          title="Appointment Booked Successfully!"
        >
          <div className="text-center py-6 space-y-4">
            <div className="h-16 w-16 bg-green-50 dark:bg-green-955 text-green-550 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Appointment Confirmed</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Your consultation slot has been reserved. You can view, pay due fees, or join video meetings directly under the <span className="font-bold text-primary">My Appointments</span> dashboard tab.
              </p>
            </div>

            <div className="pt-4">
              <button
                onClick={() => {
                  setBookingSuccessModalOpen(false);
                  setSelectedDocForBooking(null);
                }}
                className="bg-primary hover:bg-primary/95 text-white px-8 py-2.5 rounded-xl text-xs font-bold shadow-md transition-colors w-full sm:w-auto cursor-pointer"
              >
                Okay
              </button>
            </div>
          </div>
        </CustomModal>
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
                <DatePicker
                  value={patDob}
                  onChange={setPatDob}
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

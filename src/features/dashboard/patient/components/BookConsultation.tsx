"use client";

import React, { useState, useMemo } from "react";
import { 
  Doctor, 
  Specialty, 
  Schedule 
} from "@/types";
import { 
  Calendar, 
  Search, 
  MapPin, 
  Clock, 
  CreditCard,
  CheckCircle2,
  X 
} from "lucide-react";
import { mockDoctorSchedules } from "../data/mockPatientData";
import { CustomModal } from "@/components/ui/custom-modal";

interface BookConsultationProps {
  doctors: Doctor[];
  specialties: Specialty[];
  schedules: Schedule[];
  bookAppointment: (doctorId: string, scheduleId: string, payNow: boolean) => void;
}

export function BookConsultation({
  doctors,
  specialties,
  schedules,
  bookAppointment,
}: BookConsultationProps) {
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

  // Filter doctors for the booking tab
  const bookingFilteredDoctors = useMemo(() => {
    return doctors.filter(doc => {
      if (doc.isDeleted) return false;
      const matchesSearch = doc.name.toLowerCase().includes(bookSearch.toLowerCase()) || 
                            doc.qualification.toLowerCase().includes(bookSearch.toLowerCase());
      const matchesSpecialty = !bookSpec || doc.specialties.some(s => s.specialtyId === bookSpec);
      return matchesSearch && matchesSpecialty;
    });
  }, [doctors, bookSearch, bookSpec]);

  // Group slots by Date for the selected doctor
  const docClaimedSlots = useMemo(() => {
    if (!selectedDocForBooking) return [];
    return schedules.filter(s => {
      const link = mockDoctorSchedules.find(ds => ds.scheduleId === s.id && ds.doctorId === selectedDocForBooking.id);
      return link && !s.isBooked;
    });
  }, [selectedDocForBooking, schedules]);

  const groupedSlots = useMemo(() => {
    const groups: { [key: string]: Schedule[] } = {};
    docClaimedSlots.forEach((slot) => {
      const dateKey = new Date(slot.startDateTime).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(slot);
    });
    return groups;
  }, [docClaimedSlots]);

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

              <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-855 mt-5 pt-3">
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
          <Calendar className="h-8 w-8 text-slate-355 mx-auto" />
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
                        : "border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-350"
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
                        : "border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-350"
                    }`}
                  >
                    Book & Pay Later
                  </button>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setSelectedDocForBooking(null)}
                    className="px-5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 cursor-pointer"
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
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1.5">Card Number</label>
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
                  <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1.5">Expiry Date</label>
                  <input
                    type="text"
                    required
                    value={expiryVal}
                    onChange={(e) => setExpiryVal(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-center dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1.5">CVC Code</label>
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
              <button type="button" onClick={() => setBookingPaymentModalOpen(false)} className="px-4 py-2 border border-slate-200 dark:border-slate-850 rounded-xl text-slate-500 hover:bg-slate-50 text-xs font-semibold cursor-pointer">Cancel</button>
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
          <div className="h-16 w-16 bg-green-50 dark:bg-green-950 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="h-10 w-10 text-green-550" />
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

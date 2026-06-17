"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CommonLayout from "../../layout";
import { useAuth } from "@/providers/authProvider";
import { CustomModal } from "@/components/ui/custom-modal";
import { mockDoctorSchedules } from "@/constants/mockData";
import { 
  Star, 
  MapPin, 
  Clock, 
  GraduationCap, 
  Briefcase, 
  Building, 
  DollarSign, 
  Calendar,
  CreditCard,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function DoctorDetails({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { doctors, schedules, reviews, bookAppointment, currentUser } = useAuth();
  
  // Find doctor
  const doctor = doctors.find((d) => d.id === id);

  // Selector state
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [bookingType, setBookingType] = useState<"pay_now" | "pay_later">("pay_now");

  // Stripe mock inputs
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [expiry, setExpiry] = useState("12/28");
  const [cvc, setCvc] = useState("123");
  const [loadingPayment, setLoadingPayment] = useState(false);

  if (!doctor) {
    return (
      <CommonLayout>
        <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto animate-bounce" />
          <h1 className="text-2xl font-bold">Doctor Not Found</h1>
          <p className="text-slate-500 text-sm">We couldn't locate this doctor profile in the directory.</p>
          <Link href="/doctors" className="inline-block bg-primary text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md">
            Return to Directory
          </Link>
        </div>
      </CommonLayout>
    );
  }

  // Get claimed & unbooked schedules for this doctor
  const doctorClaimedSlots = schedules.filter((s) => {
    // Find matching link in mockDoctorSchedules
    const link = mockDoctorSchedules.find(
      (ds) => ds.scheduleId === s.id && ds.doctorId === doctor.id
    );
    return link && !s.isBooked; // Slot claimed by doctor and not yet booked by a patient
  });

  // Get reviews written for this doctor
  const doctorReviews = reviews.filter((r) => r.doctorId === doctor.id);

  // Group schedules by Date
  const groupSchedulesByDate = () => {
    const groups: { [key: string]: typeof doctorClaimedSlots } = {};
    doctorClaimedSlots.forEach((slot) => {
      const dateKey = new Date(slot.startDateTime).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(slot);
    });
    return groups;
  };

  const groupedSlots = groupSchedulesByDate();

  const handleBookingSubmit = (type: "pay_now" | "pay_later") => {
    if (!currentUser) {
      // Prompt login
      router.push(`/login?redirect=/doctors/${doctor.id}`);
      return;
    }

    if (!selectedScheduleId) return;

    setBookingType(type);

    if (type === "pay_now") {
      setCheckoutModalOpen(true);
    } else {
      // Book directly
      bookAppointment(doctor.id, selectedScheduleId, false);
      setSuccessModalOpen(true);
    }
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedScheduleId) return;

    setLoadingPayment(true);
    // Simulate API delay
    setTimeout(() => {
      bookAppointment(doctor.id, selectedScheduleId, true);
      setLoadingPayment(false);
      setCheckoutModalOpen(false);
      setSuccessModalOpen(true);
    }, 2000);
  };

  return (
    <CommonLayout>
      <div className="bg-slate-50 dark:bg-slate-950 py-10 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Breadcrumbs */}
          <div className="text-xs text-slate-400 font-medium">
            <Link href="/" className="hover:text-primary">Home</Link> &bull;{" "}
            <Link href="/doctors" className="hover:text-primary">Doctors</Link> &bull;{" "}
            <span className="text-slate-600 dark:text-slate-300">{doctor.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Doctor Details & Reviews (8 cols) */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Profile Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
                  <img
                    src={doctor.profilePhoto}
                    alt={doctor.name}
                    className="h-28 w-28 rounded-2xl object-cover border border-slate-100 dark:border-slate-700 flex-shrink-0"
                  />
                  <div className="space-y-3 flex-1">
                    <div className="space-y-1">
                      <span className="bg-primary/10 text-primary text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                        {doctor.specialties[0]?.specialty?.title}
                      </span>
                      <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                        {doctor.name}
                      </h1>
                      <p className="text-sm font-semibold text-slate-500">{doctor.designation}</p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-slate-400" />
                        {doctor.experience} Years Experience
                      </span>
                      <span className="text-slate-200">|</span>
                      <span className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="h-4 w-4 fill-amber-500" />
                        {doctor.averageRating} Rating
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl pt-2">
                      Dr. {doctor.name.split(" ").slice(1).join(" ")} is a distinguished medical expert with a deep background in clinical patient assessment and diagnostic evaluations. She operates with absolute adherence to the highest international medical practices.
                    </p>
                  </div>
                </div>

                <hr className="border-slate-100 dark:border-slate-850" />

                {/* Professional Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm">
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl text-slate-500 h-10 w-10 flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Qualifications</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 leading-tight block mt-0.5">{doctor.qualification}</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl text-slate-500 h-10 w-10 flex items-center justify-center flex-shrink-0">
                        <Briefcase className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Designation</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 leading-tight block mt-0.5">{doctor.designation}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl text-slate-500 h-10 w-10 flex items-center justify-center flex-shrink-0">
                        <Building className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Current Workplace</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 leading-tight block mt-0.5">{doctor.currentWorkplace}</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl text-slate-500 h-10 w-10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Clinic Address</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 leading-tight block mt-0.5">{doctor.address}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews Feed */}
              <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-850">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Patient Reviews ({doctorReviews.length})
                  </h2>
                  <div className="flex items-center gap-1.5 text-amber-500 text-sm font-bold">
                    <Star className="h-4 w-4 fill-amber-500" />
                    {doctor.averageRating} out of 5
                  </div>
                </div>

                {doctorReviews.length > 0 ? (
                  <div className="space-y-6">
                    {doctorReviews.map((rev) => (
                      <div key={rev.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-slate-200 flex-shrink-0 overflow-hidden">
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
                        <hr className="border-slate-50 dark:border-slate-850/50 mt-4" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-slate-400 text-xs font-medium">
                    No reviews submitted yet for this doctor.
                  </div>
                )}
              </div>
            </div>

            {/* Right: Booking Widget (4 cols) */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6 sticky top-24">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-850">
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Select Schedule
                </h2>
                <div className="text-right">
                  <span className="block text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Consult Fee</span>
                  <span className="text-lg font-bold text-primary">৳{doctor.appointmentFee}</span>
                </div>
              </div>

              {/* Time Slots Calendar selector */}
              {doctorClaimedSlots.length > 0 ? (
                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                  {Object.entries(groupedSlots).map(([dateLabel, slots]) => (
                    <div key={dateLabel} className="space-y-2">
                      <h4 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        {dateLabel}
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {slots.map((slot) => {
                          const isSelected = selectedScheduleId === slot.id;
                          const startTimeStr = new Date(slot.startDateTime).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          });
                          return (
                            <button
                              key={slot.id}
                              onClick={() => setSelectedScheduleId(slot.id)}
                              className={`py-2 px-3 rounded-xl border text-xs font-medium text-center transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-primary border-primary text-white font-bold shadow-md shadow-primary/20"
                                  : "border-slate-200 hover:border-primary/50 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                              }`}
                            >
                              {startTimeStr}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 px-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
                  <Calendar className="h-8 w-8 text-slate-300 mx-auto" />
                  <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">No Schedules Available</h4>
                  <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                    This doctor hasn't claimed any active scheduling slots for the upcoming days. Please check back later.
                  </p>
                </div>
              )}

              {/* Booking CTAs */}
              {doctorClaimedSlots.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-850">
                  {!currentUser && (
                    <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900 rounded-xl p-3 flex gap-2 items-start text-[11px] text-amber-600 dark:text-amber-400">
                      <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <span>You must sign in to book consultations.</span>
                    </div>
                  )}

                  <button
                    onClick={() => handleBookingSubmit("pay_now")}
                    disabled={!selectedScheduleId}
                    className="w-full bg-primary hover:bg-primary/95 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none text-white py-3.5 rounded-xl text-xs font-bold shadow-md shadow-primary/15 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <CreditCard className="h-4 w-4" />
                    Pay and Book Now
                  </button>
                  <button
                    onClick={() => handleBookingSubmit("pay_later")}
                    disabled={!selectedScheduleId}
                    className="w-full border border-slate-200 dark:border-slate-700 hover:border-slate-300 disabled:border-slate-100 disabled:text-slate-300 text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 py-3.5 rounded-xl text-xs font-bold transition-all text-center cursor-pointer disabled:cursor-not-allowed"
                  >
                    Book and Pay Later
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stripe Payment Mock Modal */}
      <CustomModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        title="Stripe Payment Checkout"
      >
        <form onSubmit={handleConfirmPayment} className="space-y-6">
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl flex justify-between text-xs text-slate-500">
            <div>
              <span className="block font-semibold text-slate-700 dark:text-slate-300">Appointment with:</span>
              <span>{doctor.name}</span>
            </div>
            <div className="text-right">
              <span className="block font-semibold text-slate-700 dark:text-slate-300">Total Amount:</span>
              <span className="text-primary font-bold text-sm">৳{doctor.appointmentFee}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Card Number
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="text"
                  required
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="xxxx xxxx xxxx xxxx"
                  className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Expiration Date
                </label>
                <input
                  type="text"
                  required
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  placeholder="MM/YY"
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:border-primary transition-colors text-center"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  CVC
                </label>
                <input
                  type="password"
                  required
                  maxLength={4}
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                  placeholder="xxx"
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:border-primary transition-colors text-center"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setCheckoutModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loadingPayment}
              className="bg-primary hover:bg-primary/95 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-primary/10 transition-colors flex items-center gap-2 min-w-[120px] justify-center"
            >
              {loadingPayment ? (
                <>
                  <div className="h-3.5 w-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Paying...
                </>
              ) : (
                `Pay ৳${doctor.appointmentFee}`
              )}
            </button>
          </div>
        </form>
      </CustomModal>

      {/* Booking Success Dialog */}
      <CustomModal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        title="Appointment Booked Successfully!"
      >
        <div className="text-center py-6 space-y-4">
          <div className="h-16 w-16 bg-green-50 dark:bg-green-950 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Congratulations!</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              Your appointment with <span className="font-bold text-slate-700 dark:text-slate-300">{doctor.name}</span> has been confirmed. 
              {bookingType === "pay_now" 
                ? " The payment was successfully verified and your slots are reserved." 
                : " The appointment status is UNPAID. Settle the balance in your dashboard within 30 minutes to avoid cancellation."
              }
            </p>
          </div>

          <div className="flex gap-3 justify-center pt-6">
            <button
              onClick={() => {
                setSuccessModalOpen(false);
                setSelectedScheduleId(null);
              }}
              className="px-5 py-2.5 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Book Another
            </button>
            <button
              onClick={() => {
                setSuccessModalOpen(false);
                router.push("/dashboard");
              }}
              className="bg-primary hover:bg-primary/95 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </CustomModal>
    </CommonLayout>
  );
}

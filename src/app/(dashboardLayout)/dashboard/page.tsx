"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/providers/authProvider";
import { CustomModal } from "@/components/ui/custom-modal";
import { mockDoctorSchedules } from "@/constants/mockData";
import { 
  AppointmentStatus, 
  PaymentStatus, 
  Role, 
  UserStatus, 
  Gender, 
  BloodGroup,
  Appointment,
  Patient,
  Doctor,
  Admin
} from "@/types";
import { 
  Star, 
  Stethoscope,
  UserCheck, 
  UserCheck2,
  Users,
  Video, 
  FileText, 
  Clock, 
  X, 
  Plus, 
  Trash2, 
  Check, 
  AlertCircle,
  FileSpreadsheet,
  Activity,
  Heart,
  Calendar,
  CreditCard,
  Ban,
  DollarSign,
  ChevronRight,
  ShieldCheck,
  Building,
  Briefcase
} from "lucide-react";

// Wrapped component to read searchParams safely inside Suspense
function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";

  const {
    activeRole,
    currentProfile,
    appointments,
    prescriptions,
    reviews,
    schedules,
    doctors,
    patients,
    specialties,
    users,
    admins,
    // Actions
    updatePatientProfile,
    uploadMedicalReport,
    deleteMedicalReport,
    claimSlot,
    releaseSlot,
    cancelAppointment,
    initiatePayment,
    addReview,
    startConsultation,
    completeAppointment,
    writePrescription,
    addSpecialty,
    deleteSpecialty,
    generateSchedules,
    registerDoctor,
    deleteDoctor,
    changeUserStatus,
    changeUserRole,
    updateAppointmentStatus,
    createAdmin,
    deleteAdmin
  } = useAuth();

  // ----------------------------------------------------
  // Local UI Modal States
  // ----------------------------------------------------
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [activeAppointmentId, setActiveAppointmentId] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  const [prescriptionModalOpen, setPrescriptionModalOpen] = useState(false);
  const [prescriptionInstructions, setPrescriptionInstructions] = useState("");
  const [prescriptionFollowUp, setPrescriptionFollowUp] = useState("");

  const [videoCallModalOpen, setVideoCallModalOpen] = useState(false);
  const [videoCallAppt, setVideoCallAppt] = useState<Appointment | null>(null);
  const [callTimer, setCallTimer] = useState(0);
  const [muteAudio, setMuteAudio] = useState(false);
  const [stopVideo, setStopVideo] = useState(false);

  const [patientRecordModalOpen, setPatientRecordModalOpen] = useState(false);
  const [inspectPatient, setInspectPatient] = useState<any>(null);

  const [specialtyModalOpen, setSpecialtyModalOpen] = useState(false);
  const [specialtyTitle, setSpecialtyTitle] = useState("");
  const [specialtyDesc, setSpecialtyDesc] = useState("");

  const [doctorModalOpen, setDoctorModalOpen] = useState(false);
  const [doctorName, setDoctorName] = useState("");
  const [doctorEmail, setDoctorEmail] = useState("");
  const [doctorPhone, setDoctorPhone] = useState("");
  const [doctorAddress, setDoctorAddress] = useState("");
  const [doctorReg, setDoctorReg] = useState("");
  const [doctorExp, setDoctorExp] = useState(5);
  const [doctorGender, setDoctorGender] = useState<Gender>(Gender.MALE);
  const [doctorFee, setDoctorFee] = useState(1000);
  const [doctorQual, setDoctorQual] = useState("");
  const [doctorWork, setDoctorWork] = useState("");
  const [doctorDesg, setDoctorDesg] = useState("Consultant");
  const [doctorSpecs, setDoctorSpecs] = useState<string[]>([]);

  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPhone, setAdminPhone] = useState("");
  const [adminRole, setAdminRole] = useState<Role>(Role.ADMIN);

  // Patient Profile Edit inputs
  const [patName, setPatName] = useState("");
  const [patPhone, setPatPhone] = useState("");
  const [patAddress, setPatAddress] = useState("");
  const [patGender, setPatGender] = useState<Gender>(Gender.MALE);
  const [patBlood, setPatBlood] = useState<BloodGroup>(BloodGroup.O_POSITIVE);
  const [patDob, setPatDob] = useState("");
  const [patHeight, setPatHeight] = useState("");
  const [patWeight, setPatWeight] = useState("");
  const [patAllergies, setPatAllergies] = useState(false);
  const [patDiabetes, setPatDiabetes] = useState(false);
  const [patSmoking, setPatSmoking] = useState(false);
  const [patDiet, setPatDiet] = useState("");
  const [patHistory, setPatHistory] = useState("");
  const [patMarital, setPatMarital] = useState("");
  const [reportFileName, setReportFileName] = useState("");

  // Schedule template generator inputs
  const [genStartD, setGenStartD] = useState("2026-07-01");
  const [genEndD, setGenEndD] = useState("2026-07-05");
  const [genStartT, setGenStartT] = useState("09:00");
  const [genEndT, setGenEndT] = useState("17:00");

  // Load Patient Profile inputs when tab is profile
  useEffect(() => {
    if (activeRole === Role.PATIENT && currentProfile) {
      const p = currentProfile as Patient;
      setPatName(p.name);
      setPatPhone(p.contactNumber || "");
      setPatAddress(p.address || "");
      if (p.patientHealthData) {
        setPatGender(p.patientHealthData.gender);
        setPatBlood(p.patientHealthData.bloodGroup);
        setPatDob(p.patientHealthData.dateOfBirth ? p.patientHealthData.dateOfBirth.split("T")[0] : "");
        setPatHeight(p.patientHealthData.height);
        setPatWeight(p.patientHealthData.weight);
        setPatAllergies(p.patientHealthData.hasAllergies);
        setPatDiabetes(p.patientHealthData.hasDiabetes);
        setPatSmoking(p.patientHealthData.smokingStatus);
        setPatDiet(p.patientHealthData.dietaryPreferences);
        setPatHistory(p.patientHealthData.mentalHealthHistory);
        setPatMarital(p.patientHealthData.maritalStatus);
      }
    }
  }, [currentProfile, activeRole, activeTab]);

  // Video call duration simulation
  useEffect(() => {
    let interval: any;
    if (videoCallModalOpen) {
      interval = setInterval(() => {
        setCallTimer((prev) => prev + 1);
      }, 1000);
    } else {
      setCallTimer(0);
    }
    return () => clearInterval(interval);
  }, [videoCallModalOpen]);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // ----------------------------------------------------
  // Action Handlers
  // ----------------------------------------------------
  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePatientProfile(
      { name: patName, contactNumber: patPhone, address: patAddress },
      {
        gender: patGender,
        dateOfBirth: patDob ? new Date(patDob).toISOString() : new Date().toISOString(),
        bloodGroup: patBlood,
        hasAllergies: patAllergies,
        hasDiabetes: patDiabetes,
        height: patHeight,
        weight: patWeight,
        smokingStatus: patSmoking,
        dietaryPreferences: patDiet,
        mentalHealthHistory: patHistory,
        maritalStatus: patMarital
      }
    );
    alert("Health profile updated successfully in memory.");
  };

  const handleReportUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportFileName) return;
    uploadMedicalReport(reportFileName);
    setReportFileName("");
  };

  const triggerReviewModal = (apptId: string) => {
    setActiveAppointmentId(apptId);
    setReviewRating(5);
    setReviewComment("");
    setReviewModalOpen(true);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAppointmentId) return;
    addReview(activeAppointmentId, reviewRating, reviewComment);
    setReviewModalOpen(false);
    setActiveAppointmentId(null);
  };

  const triggerPrescriptionModal = (apptId: string) => {
    setActiveAppointmentId(apptId);
    setPrescriptionInstructions("");
    setPrescriptionFollowUp("2026-06-30");
    setPrescriptionModalOpen(true);
  };

  const handlePrescriptionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAppointmentId) return;
    writePrescription(activeAppointmentId, prescriptionInstructions, prescriptionFollowUp);
    setPrescriptionModalOpen(false);
    setActiveAppointmentId(null);
  };

  const handleTriggerVideoCall = (appt: Appointment) => {
    setVideoCallAppt(appt);
    setVideoCallModalOpen(true);
    startConsultation(appt.id);
  };

  const handleEndVideoCall = () => {
    if (videoCallAppt) {
      completeAppointment(videoCallAppt.id);
    }
    setVideoCallModalOpen(false);
    setVideoCallAppt(null);
  };

  const triggerPatientRecordModal = (patientEmail: string) => {
    const pat = patients.find(p => p.email === patientEmail);
    if (pat) {
      setInspectPatient(pat);
      setPatientRecordModalOpen(true);
    }
  };

  const handleAddSpecialtySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!specialtyTitle || !specialtyDesc) return;
    addSpecialty(specialtyTitle, specialtyDesc, "");
    setSpecialtyTitle("");
    setSpecialtyDesc("");
    setSpecialtyModalOpen(false);
  };

  const handleGenerateSlotsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateSchedules(genStartD, genEndD, genStartT, genEndT);
    alert("System schedules generated dynamically.");
  };

  const handleRegisterDoctorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorName || !doctorEmail) return;
    registerDoctor({
      name: doctorName,
      email: doctorEmail,
      contactNumber: doctorPhone,
      address: doctorAddress,
      registrationNumber: doctorReg,
      experience: doctorExp,
      gender: doctorGender,
      appointmentFee: doctorFee,
      qualification: doctorQual,
      currentWorkplace: doctorWork,
      designation: doctorDesg
    }, doctorSpecs);

    setDoctorName("");
    setDoctorEmail("");
    setDoctorPhone("");
    setDoctorAddress("");
    setDoctorReg("");
    setDoctorExp(5);
    setDoctorSpecs([]);
    setDoctorModalOpen(false);
  };

  const handleCreateAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminName || !adminEmail) return;
    createAdmin(adminName, adminEmail, adminPhone, adminRole);
    setAdminName("");
    setAdminEmail("");
    setAdminPhone("");
    setAdminModalOpen(false);
  };

  const toggleSpecialtySelection = (specId: string) => {
    setDoctorSpecs(prev => 
      prev.includes(specId) ? prev.filter(id => id !== specId) : [...prev, specId]
    );
  };

  // ----------------------------------------------------
  // Dashboard Overviews Filtering
  // ----------------------------------------------------
  const patientAppointments = appointments.filter(a => a.patientId === currentProfile?.id);
  const patientReviews = reviews.filter(r => r.patient.name === currentProfile?.name);
  const patientPrescriptions = prescriptions.filter(p => p.patient.name === currentProfile?.name);

  const doctorAppointments = appointments.filter(a => a.doctorId === currentProfile?.id);
  const doctorReviews = reviews.filter(r => r.doctorId === currentProfile?.id);
  const doctorPrescriptions = prescriptions.filter(p => p.doctor.name === currentProfile?.name);

  // ----------------------------------------------------
  // RENDER DYNAMIC DASHBOARDS
  // ----------------------------------------------------

  // A. PATIENT PORTAL
  const renderPatientDashboard = () => {
    if (activeTab === "overview") {
      const activeAppts = patientAppointments.filter(a => a.status === AppointmentStatus.SCHEDULED || a.status === AppointmentStatus.INPROGRESS);
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
              <tbody className="divide-y divide-slate-50 dark:divide-slate-850/50">
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
                          appt.status === AppointmentStatus.COMPLETED ? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400" :
                          appt.status === AppointmentStatus.CANCELED ? "bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400" :
                          "bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400"
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
                <tr className="border-b border-slate-100 dark:border-slate-850 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-4 px-4">Doctor Name</th>
                  <th className="py-4 px-4">Date Issued</th>
                  <th className="py-4 px-4">Instructions Summary</th>
                  <th className="py-4 px-4">Follow-Up Date</th>
                  <th className="py-4 px-4 text-right">Download</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-850/50">
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
      const p = currentProfile as Patient;
      return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
          {/* Left Panel: Profile settings */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
            <form onSubmit={handleProfileSave} className="space-y-6">
              <h2 className="text-lg font-bold text-slate-950 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-850">
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
                  <label htmlFor="patAllergies" className="font-semibold text-slate-600 dark:text-slate-400 cursor-pointer">Has Allergies</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="patDiabetes"
                    checked={patDiabetes}
                    onChange={(e) => setPatDiabetes(e.target.checked)}
                    className="h-4 w-4 text-primary rounded-sm border-slate-350"
                  />
                  <label htmlFor="patDiabetes" className="font-semibold text-slate-600 dark:text-slate-400 cursor-pointer">Has Diabetes</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="patSmoking"
                    checked={patSmoking}
                    onChange={(e) => setPatSmoking(e.target.checked)}
                    className="h-4 w-4 text-primary rounded-sm border-slate-350"
                  />
                  <label htmlFor="patSmoking" className="font-semibold text-slate-600 dark:text-slate-400 cursor-pointer">Smoking Status</label>
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
              <div className="bg-amber-50 dark:bg-amber-950/20 text-amber-600 p-3 rounded-xl border border-amber-100 text-xs">
                Uploader limit reached (5 files max).
              </div>
            )}
          </div>
        </div>
      );
    }
  };

  // B. DOCTOR PORTAL
  const renderDoctorDashboard = () => {
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
                <tr className="border-b border-slate-100 dark:border-slate-850 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-4 px-4">Patient Name</th>
                  <th className="py-4 px-4">Demographics</th>
                  <th className="py-4 px-4">Date & Time</th>
                  <th className="py-4 px-4 text-center">Payment</th>
                  <th className="py-4 px-4 text-center">Status</th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-850/50">
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
            <p className="text-xs text-slate-400 mt-1">Historical list of medical prescriptions issued by you for your patients.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-850 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-4 px-4">Patient</th>
                  <th className="py-4 px-4">Date Prescribed</th>
                  <th className="py-4 px-4">Instructions Detail</th>
                  <th className="py-4 px-4">Follow-Up Date</th>
                  <th className="py-4 px-4 text-right">PDF Guide</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-850/50">
                {doctorPrescriptions.length > 0 ? (
                  doctorPrescriptions.map((pres) => (
                    <tr key={pres.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                      <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">{pres.patient.name}</td>
                      <td className="py-4 px-4 text-slate-500">
                        {new Date(pres.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td className="py-4 px-4 max-w-xs truncate text-slate-600 dark:text-slate-300">{pres.instructions}</td>
                      <td className="py-4 px-4 text-slate-500 font-semibold">{pres.followUpDate}</td>
                      <td className="py-4 px-4 text-right">
                        <a
                          href="#"
                          onClick={(e) => { e.preventDefault(); alert("Simulating PDF download..."); }}
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
                  <hr className="border-slate-50 dark:border-slate-850/50 mt-4" />
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
  };

  // C. CLINIC ADMIN PORTAL
  const renderAdminDashboard = () => {
    if (activeTab === "overview") {
      const activeUsers = users.filter(u => u.status === UserStatus.ACTIVE);
      const totalRevenue = appointments.filter(a => a.paymentStatus === PaymentStatus.PAID).reduce((sum, a) => sum + a.doctor.appointmentFee, 0);
      return (
        <div className="space-y-8 animate-fadeIn">
          {/* Stats matrix */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-150 dark:border-slate-800 shadow-xs flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary"><Calendar className="h-6 w-6" /></div>
              <div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Appointments</span>
                <span className="text-xl font-extrabold text-slate-900 dark:text-white">{appointments.length}</span>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-150 dark:border-slate-800 shadow-xs flex items-center gap-4">
              <div className="p-3 bg-emerald-100 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 rounded-2xl"><Users className="h-6 w-6" /></div>
              <div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Users</span>
                <span className="text-xl font-extrabold text-slate-900 dark:text-white">{activeUsers.length}</span>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-150 dark:border-slate-800 shadow-xs flex items-center gap-4">
              <div className="p-3 bg-purple-100 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400 rounded-2xl"><DollarSign className="h-6 w-6" /></div>
              <div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Clinic Revenue</span>
                <span className="text-xl font-extrabold text-slate-900 dark:text-white">৳{totalRevenue}</span>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-150 dark:border-slate-800 shadow-xs flex items-center gap-4">
              <div className="p-3 bg-amber-100 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400 rounded-2xl"><Stethoscope className="h-6 w-6" /></div>
              <div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Doctors</span>
                <span className="text-xl font-extrabold text-slate-900 dark:text-white">{doctors.filter(d => !d.isDeleted).length}</span>
              </div>
            </div>
          </div>

          {/* SVG Bar Chart and Donut charts */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-150 dark:border-slate-800 shadow-xs">
              <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-6 uppercase tracking-wider border-b border-slate-50 dark:border-slate-850 pb-2">
                Monthly Appointment Traffic
              </h3>
              
              {/* SVG Bar Chart */}
              <div className="h-64 w-full flex items-end justify-between px-2 pt-4">
                {[
                  { month: "Jan", count: 20 },
                  { month: "Feb", count: 25 },
                  { month: "Mar", count: 32 },
                  { month: "Apr", count: 38 },
                  { month: "May", count: 42 },
                  { month: "Jun", count: 27 }
                ].map((item, idx) => {
                  const maxVal = 50;
                  const heightPercent = (item.count / maxVal) * 100;
                  return (
                    <div key={idx} className="flex flex-col items-center gap-2 flex-1 group">
                      <div className="relative w-8 bg-primary/10 group-hover:bg-primary/20 rounded-t-lg flex items-end h-48 transition-colors">
                        <div 
                          className="w-full bg-primary rounded-t-lg transition-all duration-500" 
                          style={{ height: `${heightPercent}%` }}
                        />
                        {/* Hover Tooltip */}
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity">
                          {item.count}
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-450 dark:text-slate-400">{item.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-150 dark:border-slate-800 shadow-xs">
              <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-6 uppercase tracking-wider border-b border-slate-50 dark:border-slate-850 pb-2">
                Appointments Distribution
              </h3>
              <div className="space-y-4 py-4">
                {["COMPLETED", "SCHEDULED", "CANCELED"].map(status => {
                  const count = appointments.filter(a => a.status === status).length;
                  const total = appointments.length || 1;
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
          </div>
        </div>
      );
    }

    if (activeTab === "admin-specialties") {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
          {/* Specialties List */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-850">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Specialty Directory</h2>
                <p className="text-xs text-slate-400 mt-0.5">List of medical specialties currently active in the clinic database.</p>
              </div>
              <button
                onClick={() => setSpecialtyModalOpen(true)}
                className="bg-primary hover:bg-primary/95 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Add Specialty
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {specialties.map(spec => (
                <div key={spec.id} className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center p-2 border border-slate-100 dark:border-slate-800">
                      <img src={spec.icon} alt={spec.title} className="h-full w-full object-contain" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">{spec.title}</span>
                      <span className="text-[10px] text-slate-400 truncate max-w-[150px] block mt-0.5">{spec.description}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteSpecialty(spec.id)}
                    className="p-2 hover:bg-red-50 text-red-500 rounded-xl cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Specialty Modal form */}
          <CustomModal
            isOpen={specialtyModalOpen}
            onClose={() => setSpecialtyModalOpen(false)}
            title="Register Medical Specialty"
          >
            <form onSubmit={handleAddSpecialtySubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Specialty Title</label>
                <input
                  type="text"
                  required
                  value={specialtyTitle}
                  onChange={(e) => setSpecialtyTitle(e.target.value)}
                  placeholder="Cardiology / Neurology"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-hidden"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Description</label>
                <textarea
                  rows={4}
                  required
                  value={specialtyDesc}
                  onChange={(e) => setSpecialtyDesc(e.target.value)}
                  placeholder="Summarize specialty clinical treatments..."
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-hidden resize-none"
                />
              </div>
              
              <div className="flex gap-2 justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSpecialtyModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 hover:bg-slate-50 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary/95 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md cursor-pointer"
                >
                  Add Specialty
                </button>
              </div>
            </form>
          </CustomModal>
        </div>
      );
    }

    if (activeTab === "admin-schedules") {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
          {/* Generator Form Panel */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
            <form onSubmit={handleGenerateSlotsSubmit} className="space-y-5 text-xs">
              <div className="pb-3 border-b border-slate-100 dark:border-slate-850">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Clinic Slot Generator</h3>
                <p className="text-[10px] text-slate-400 mt-1">Generate 30-minute interval blocks daily across a specified date range.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-slate-400 uppercase">Start Date</label>
                  <input
                    type="date"
                    value={genStartD}
                    onChange={(e) => setGenStartD(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-705"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-slate-400 uppercase">End Date</label>
                  <input
                    type="date"
                    value={genEndD}
                    onChange={(e) => setGenEndD(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-705"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-slate-400 uppercase">Start Time</label>
                  <input
                    type="time"
                    value={genStartT}
                    onChange={(e) => setGenStartT(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-755"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-slate-400 uppercase">End Time</label>
                  <input
                    type="time"
                    value={genEndT}
                    onChange={(e) => setGenEndT(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-755"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary/95 text-white py-2.5 rounded-xl font-bold shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="h-4 w-4" />
                Generate Time Blocks
              </button>
            </form>
          </div>

          {/* Slots Table Grid */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-50 dark:border-slate-850 pb-3">
              Generated System Time Blocks ({schedules.length})
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto pr-1">
              {schedules.map((slot) => {
                const startStr = new Date(slot.startDateTime).toLocaleDateString("en-US", { month: "short", day: "numeric" }) + " @ " + new Date(slot.startDateTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
                return (
                  <div key={slot.id} className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-350 flex justify-between items-center">
                    <span>{startStr}</span>
                    {slot.isBooked && (
                      <span className="bg-emerald-100 text-emerald-700 px-1 py-0.5 rounded-sm font-bold">Booked</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === "admin-doctors") {
      const activeDocs = doctors.filter(d => !d.isDeleted);
      return (
        <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-6 shadow-xs animate-fadeIn space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-850">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Doctor Directory CRUD</h2>
              <p className="text-xs text-slate-400 mt-0.5">Manage doctor account registrations, specialties tags, qualifications, and consulting fees.</p>
            </div>
            <button
              onClick={() => setDoctorModalOpen(true)}
              className="bg-primary hover:bg-primary/95 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Register Doctor
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-850 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-4 px-4">Doctor Name</th>
                  <th className="py-4 px-4">Workplace Details</th>
                  <th className="py-4 px-4">Contact</th>
                  <th className="py-4 px-4 text-center">Consult Fee</th>
                  <th className="py-4 px-4 text-center">Rating</th>
                  <th className="py-4 px-4 text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-850/50">
                {activeDocs.map(doc => (
                  <tr key={doc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                    <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">
                      <div className="flex gap-2.5 items-center">
                        <img src={doc.profilePhoto} className="h-8 w-8 rounded-lg object-cover border border-slate-100 dark:border-slate-700 flex-shrink-0" />
                        <div>
                          <span>{doc.name}</span>
                          <span className="block text-[9px] text-primary font-bold mt-0.5">{doc.specialties[0]?.specialty?.title || "Specialist"}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-500">{doc.designation} at {doc.currentWorkplace}</td>
                    <td className="py-4 px-4 text-slate-500">{doc.email}</td>
                    <td className="py-4 px-4 text-center font-bold text-slate-800 dark:text-slate-200">৳{doc.appointmentFee}</td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-amber-500 font-bold flex items-center justify-center gap-0.5 text-xs">
                        <Star className="h-3.5 w-3.5 fill-amber-500" />
                        {doc.averageRating}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => deleteDoctor(doc.id)}
                        className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Doctor Registry Modal Form */}
          <CustomModal
            isOpen={doctorModalOpen}
            onClose={() => setDoctorModalOpen(false)}
            title="Register Doctor Profile Account"
            size="lg"
          >
            <form onSubmit={handleRegisterDoctorSubmit} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-slate-400 uppercase">Doctor Name</label>
                  <input type="text" required value={doctorName} onChange={(e) => setDoctorName(e.target.value)} placeholder="Dr. John Carter" className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700" />
                </div>
                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-slate-400 uppercase">Email Address</label>
                  <input type="email" required value={doctorEmail} onChange={(e) => setDoctorEmail(e.target.value)} placeholder="john.c@clinic.com" className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-slate-400 uppercase">Contact Number</label>
                  <input type="text" value={doctorPhone} onChange={(e) => setDoctorPhone(e.target.value)} placeholder="01712345679" className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700" />
                </div>
                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-slate-400 uppercase">Registration ID Number</label>
                  <input type="text" required value={doctorReg} onChange={(e) => setDoctorReg(e.target.value)} placeholder="DMC-98726" className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-slate-400 uppercase">Experience (Years)</label>
                  <input type="number" value={doctorExp} onChange={(e) => setDoctorExp(Number(e.target.value))} className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700" />
                </div>
                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-slate-400 uppercase">Gender</label>
                  <select value={doctorGender} onChange={(e) => setDoctorGender(e.target.value as Gender)} className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700">
                    <option value={Gender.MALE}>MALE</option>
                    <option value={Gender.FEMALE}>FEMALE</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-slate-400 uppercase">Consult Fee</label>
                  <input type="number" value={doctorFee} onChange={(e) => setDoctorFee(Number(e.target.value))} className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-slate-400 uppercase">Qualifications</label>
                  <input type="text" value={doctorQual} onChange={(e) => setDoctorQual(e.target.value)} placeholder="MBBS, MD (Cardiology)" className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700" />
                </div>
                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-slate-400 uppercase">Workplace Hospital</label>
                  <input type="text" value={doctorWork} onChange={(e) => setDoctorWork(e.target.value)} placeholder="National Heart Foundation" className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700" />
                </div>
              </div>

              {/* Specialties Tag selection */}
              <div className="space-y-2">
                <label className="block text-[9px] font-bold text-slate-400 uppercase">Specialty Assignment Tags</label>
                <div className="flex flex-wrap gap-2">
                  {specialties.map(spec => {
                    const isSelected = doctorSpecs.includes(spec.id);
                    return (
                      <button
                        key={spec.id}
                        type="button"
                        onClick={() => toggleSpecialtySelection(spec.id)}
                        className={`px-3 py-1.5 rounded-full border text-[10px] font-semibold transition-all ${
                          isSelected
                            ? "bg-primary text-white border-primary"
                            : "border-slate-200 text-slate-500 hover:border-primary/50"
                        }`}
                      >
                        {spec.title}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                <button type="button" onClick={() => setDoctorModalOpen(false)} className="px-4 py-2 border border-slate-200 dark:border-slate-850 rounded-xl text-slate-500 hover:bg-slate-50">Cancel</button>
                <button type="submit" className="bg-primary hover:bg-primary/95 text-white px-5 py-2 rounded-xl font-bold shadow-md cursor-pointer">Register Doctor</button>
              </div>
            </form>
          </CustomModal>
        </div>
      );
    }

    if (activeTab === "admin-users") {
      return (
        <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-6 shadow-xs animate-fadeIn space-y-6">
          <div className="pb-4 border-b border-slate-100 dark:border-slate-850">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">User Account Moderation</h2>
            <p className="text-xs text-slate-400 mt-1">Review system accounts credentials, modify registration dates, or toggle account block status.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-850 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-4 px-4">User Email</th>
                  <th className="py-4 px-4">Role Clearance</th>
                  <th className="py-4 px-4">Created Date</th>
                  <th className="py-4 px-4 text-center">Status</th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-850/50">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                    <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">{u.email}</td>
                    <td className="py-4 px-4 text-slate-500">
                      <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-sm font-semibold text-[10px]">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider ${
                        u.status === UserStatus.ACTIVE ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-750"
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <select
                        value={u.status}
                        onChange={(e) => changeUserStatus(u.id, e.target.value as UserStatus)}
                        className="bg-slate-50 dark:bg-slate-850 dark:text-white px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                      >
                        <option value={UserStatus.ACTIVE}>ACTIVE</option>
                        <option value={UserStatus.BLOCKED}>BLOCKED</option>
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

    if (activeTab === "admin-audit") {
      return (
        <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-6 shadow-xs animate-fadeIn space-y-6">
          <div className="pb-4 border-b border-slate-100 dark:border-slate-850">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Clinic Appointment & Billing Auditing</h2>
            <p className="text-xs text-slate-400 mt-1">Audit billing transactions, verify payment transaction IDs, and update appointment states manually.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-850 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-4 px-4">Patient Name</th>
                  <th className="py-4 px-4">Doctor Name</th>
                  <th className="py-4 px-4">Stripe Txn ID</th>
                  <th className="py-4 px-4 text-center">Fare Amount</th>
                  <th className="py-4 px-4 text-center">Billing</th>
                  <th className="py-4 px-4 text-center">Visit Status</th>
                  <th className="py-4 px-4 text-right">Manage Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-850/50">
                {appointments.map(appt => (
                  <tr key={appt.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                    <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">{appt.patient.name}</td>
                    <td className="py-4 px-4 text-slate-550">{appt.doctor.name}</td>
                    <td className="py-4 px-4 font-mono text-[10px] text-slate-400">{appt.payment?.transactionId || "N/A"}</td>
                    <td className="py-4 px-4 text-center font-bold text-slate-800 dark:text-slate-200">৳{appt.doctor.appointmentFee}</td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider ${
                        appt.paymentStatus === PaymentStatus.PAID ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                      }`}>
                        {appt.paymentStatus}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider ${
                        appt.status === AppointmentStatus.COMPLETED ? "bg-slate-100 text-slate-650" :
                        appt.status === AppointmentStatus.CANCELED ? "bg-red-150 text-red-750" :
                        "bg-blue-100 text-blue-700"
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
  };

  // D. SUPER ADMIN PORTAL
  const renderSuperAdminDashboard = () => {
    if (activeTab === "overview") {
      const adminCount = admins.length;
      return (
        <div className="space-y-8 animate-fadeIn">
          {/* Stats widgets */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-150 dark:border-slate-800 shadow-xs flex items-center gap-4">
              <div className="p-3 bg-rose-100 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 rounded-2xl"><ShieldCheck className="h-6 w-6" /></div>
              <div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Super Admins</span>
                <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {users.filter(u => u.role === Role.SUPER_ADMIN).length}
                </span>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-150 dark:border-slate-800 shadow-xs flex items-center gap-4">
              <div className="p-3 bg-purple-100 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400 rounded-2xl"><Users className="h-6 w-6" /></div>
              <div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Clinic Admins</span>
                <span className="text-xl font-extrabold text-slate-900 dark:text-white">{adminCount}</span>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-150 dark:border-slate-800 shadow-xs flex items-center gap-4">
              <div className="p-3 bg-emerald-100 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 rounded-2xl"><UserCheck className="h-6 w-6" /></div>
              <div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Accounts</span>
                <span className="text-xl font-extrabold text-slate-900 dark:text-white">{users.length}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-150 dark:border-slate-800 shadow-xs">
              <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-4 uppercase tracking-wider border-b border-slate-50 dark:border-slate-850 pb-2">
                Super Admin Security Console
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Super Admins possess security clearance keys. You can register new administrators, override admin roles, lock blocked accounts clinic-wide, and review central database metrics.
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === "super-admins") {
      return (
        <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-6 shadow-xs animate-fadeIn space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-850">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Admin Directory & Registration</h2>
              <p className="text-xs text-slate-400 mt-0.5">Manage administrative directories and provision security keys for new admins.</p>
            </div>
            <button
              onClick={() => setAdminModalOpen(true)}
              className="bg-primary hover:bg-primary/95 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Register Admin
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-850 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-4 px-4">Admin Name</th>
                  <th className="py-4 px-4">Email Address</th>
                  <th className="py-4 px-4">Phone</th>
                  <th className="py-4 px-4 text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-850/50">
                {admins.map(adm => (
                  <tr key={adm.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                    <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">
                      <div className="flex gap-2.5 items-center">
                        <img src={adm.profilePhoto || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=30"} className="h-8 w-8 rounded-lg object-cover" />
                        <span>{adm.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-500">{adm.email}</td>
                    <td className="py-4 px-4 text-slate-500">{adm.contactNumber}</td>
                    <td className="py-4 px-4 text-right">
                      {adm.email !== "super.sefat@clinic.com" ? (
                        <button
                          onClick={() => deleteAdmin(adm.id)}
                          className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-medium">System Core</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Admin Creation Modal Form */}
          <CustomModal
            isOpen={adminModalOpen}
            onClose={() => setAdminModalOpen(false)}
            title="Register Clinic Administrative account"
          >
            <form onSubmit={handleCreateAdminSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block text-[9px] font-bold text-slate-400 uppercase">Admin Full Name</label>
                <input type="text" required value={adminName} onChange={(e) => setAdminName(e.target.value)} placeholder="Alex Vance" className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700" />
              </div>
              <div className="space-y-1">
                <label className="block text-[9px] font-bold text-slate-400 uppercase">Email Address</label>
                <input type="email" required value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} placeholder="admin.alex@clinic.com" className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-slate-400 uppercase">Phone</label>
                  <input type="text" value={adminPhone} onChange={(e) => setAdminPhone(e.target.value)} placeholder="01711223344" className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700" />
                </div>
                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-slate-400 uppercase">Select Role</label>
                  <select value={adminRole} onChange={(e) => setAdminRole(e.target.value as Role)} className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-850 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700">
                    <option value={Role.ADMIN}>ADMIN</option>
                    <option value={Role.SUPER_ADMIN}>SUPER ADMIN</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t border-slate-100 dark:border-slate-850">
                <button type="button" onClick={() => setAdminModalOpen(false)} className="px-4 py-2 border border-slate-200 dark:border-slate-850 rounded-xl text-slate-500 hover:bg-slate-50">Cancel</button>
                <button type="submit" className="bg-primary hover:bg-primary/95 text-white px-5 py-2 rounded-xl font-bold shadow-md cursor-pointer">Register Admin</button>
              </div>
            </form>
          </CustomModal>
        </div>
      );
    }

    if (activeTab === "super-users") {
      // Super admin can change user status active/blocked and toggle roles ADMIN / SUPER_ADMIN (excluding doctor/patients/self)
      const targetUsers = users.filter(u => u.email !== currentProfile?.email);
      return (
        <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-6 shadow-xs animate-fadeIn space-y-6">
          <div className="pb-4 border-b border-slate-100 dark:border-slate-850">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Role & Status Moderation Controls</h2>
            <p className="text-xs text-slate-400 mt-1">Super Admin overrides. Lock user status clinic-wide or switch roles between ADMIN and SUPER_ADMIN.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-850 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-4 px-4">User Account Email</th>
                  <th className="py-4 px-4">Active Role</th>
                  <th className="py-4 px-4">System Status</th>
                  <th className="py-4 px-4 text-center">Modify Status</th>
                  <th className="py-4 px-4 text-right">Modify Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-850/50">
                {targetUsers.map(u => {
                  const isStaff = u.role === Role.ADMIN || u.role === Role.SUPER_ADMIN;
                  return (
                    <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                      <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">{u.email}</td>
                      <td className="py-4 px-4 text-slate-500">
                        <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-sm font-semibold text-[10px]">
                          {u.role}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider ${
                          u.status === UserStatus.ACTIVE ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                        }`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <select
                          value={u.status}
                          onChange={(e) => changeUserStatus(u.id, e.target.value as UserStatus)}
                          className="bg-slate-50 dark:bg-slate-850 dark:text-white px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold cursor-pointer"
                        >
                          <option value={UserStatus.ACTIVE}>ACTIVE</option>
                          <option value={UserStatus.BLOCKED}>BLOCKED</option>
                        </select>
                      </td>
                      <td className="py-4 px-4 text-right">
                        {isStaff ? (
                          <select
                            value={u.role}
                            onChange={(e) => changeUserRole(u.id, e.target.value as Role)}
                            className="bg-slate-50 dark:bg-slate-855 dark:text-white px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold cursor-pointer"
                          >
                            <option value={Role.ADMIN}>ADMIN</option>
                            <option value={Role.SUPER_ADMIN}>SUPER_ADMIN</option>
                          </select>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-medium italic">Role Locked</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
  };

  // ----------------------------------------------------
  // Switch Render view based on role
  // ----------------------------------------------------
  const renderSelectedDashboardView = () => {
    switch (activeRole) {
      case Role.PATIENT:
        return renderPatientDashboard();
      case Role.DOCTOR:
        return renderDoctorDashboard();
      case Role.ADMIN:
        return renderAdminDashboard();
      case Role.SUPER_ADMIN:
        return renderSuperAdminDashboard();
      default:
        return (
          <div className="text-center py-20 text-slate-400 text-xs">
            Unknown portal view configuration.
          </div>
        );
    }
  };

  return (
    <>
      {renderSelectedDashboardView()}

      {/* Reusable patient review Modal */}
      <CustomModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title="Write Consultation Review"
      >
        <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs sm:text-sm">
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Rating Stars</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewRating(star)}
                  className="p-1 hover:scale-110 text-amber-400 transition-transform cursor-pointer"
                >
                  <Star className={`h-6 w-6 ${reviewRating >= star ? "fill-amber-400" : ""}`} />
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Review Comments</label>
            <textarea
              rows={4}
              required
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="How was your consultation experience? Write your comments here..."
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-xs resize-none focus:outline-hidden"
            />
          </div>

          <div className="flex gap-2 justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onClick={() => setReviewModalOpen(false)} className="px-4 py-2 border border-slate-200 dark:border-slate-850 rounded-xl text-slate-500 hover:bg-slate-50">Cancel</button>
            <button type="submit" className="bg-primary hover:bg-primary/95 text-white px-5 py-2 rounded-xl font-bold shadow-md cursor-pointer">Submit Review</button>
          </div>
        </form>
      </CustomModal>

      {/* Doctor Prescription modal */}
      <CustomModal
        isOpen={prescriptionModalOpen}
        onClose={() => setPrescriptionModalOpen(false)}
        title="Write Consultation Prescription"
      >
        <form onSubmit={handlePrescriptionSubmit} className="space-y-4 text-xs sm:text-sm">
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Clinical Instructions</label>
            <textarea
              rows={5}
              required
              value={prescriptionInstructions}
              onChange={(e) => setPrescriptionInstructions(e.target.value)}
              placeholder="Tab Napa Extend 665mg - 1+0+1 after food for 5 days..."
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-705 rounded-xl text-xs resize-none focus:outline-hidden"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Follow-Up Date</label>
            <input
              type="date"
              required
              value={prescriptionFollowUp}
              onChange={(e) => setPrescriptionFollowUp(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-705 rounded-xl text-xs"
            />
          </div>

          <div className="flex gap-2 justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onClick={() => setPrescriptionModalOpen(false)} className="px-4 py-2 border border-slate-200 dark:border-slate-850 rounded-xl text-slate-500 hover:bg-slate-50">Cancel</button>
            <button type="submit" className="bg-primary hover:bg-primary/95 text-white px-5 py-2 rounded-xl font-bold shadow-md cursor-pointer">Submit & Close Case</button>
          </div>
        </form>
      </CustomModal>

      {/* Patient Health Record Inspector Modal */}
      <CustomModal
        isOpen={patientRecordModalOpen}
        onClose={() => setPatientRecordModalOpen(false)}
        title="Patient Health Record File"
        size="lg"
      >
        {inspectPatient && (
          <div className="space-y-6 text-xs sm:text-sm">
            <div className="flex gap-4 items-center pb-4 border-b border-slate-100 dark:border-slate-850">
              <div className="h-14 w-14 rounded-full bg-slate-100 overflow-hidden border border-slate-100 dark:border-slate-700">
                <img
                  src={inspectPatient.profilePhoto || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=60"}
                  alt={inspectPatient.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{inspectPatient.name}</h3>
                <span className="text-slate-500 font-medium block">Contact: {inspectPatient.contactNumber || "N/A"} &bull; {inspectPatient.email}</span>
              </div>
            </div>

            {inspectPatient.patientHealthData ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-bold text-[10px] text-slate-400 uppercase tracking-wider">Demographic Metrics</h4>
                  <div className="space-y-1.5 text-slate-650 dark:text-slate-350">
                    <div className="flex justify-between"><span>Gender:</span> <strong className="text-slate-900 dark:text-slate-100">{inspectPatient.patientHealthData.gender}</strong></div>
                    <div className="flex justify-between"><span>Blood Group:</span> <strong className="text-slate-900 dark:text-slate-100">{inspectPatient.patientHealthData.bloodGroup}</strong></div>
                    <div className="flex justify-between"><span>Height:</span> <strong className="text-slate-900 dark:text-slate-100">{inspectPatient.patientHealthData.height}</strong></div>
                    <div className="flex justify-between"><span>Weight:</span> <strong className="text-slate-900 dark:text-slate-100">{inspectPatient.patientHealthData.weight}</strong></div>
                    <div className="flex justify-between"><span>Marital Status:</span> <strong className="text-slate-900 dark:text-slate-100">{inspectPatient.patientHealthData.maritalStatus}</strong></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-[10px] text-slate-400 uppercase tracking-wider">Clinical Disclosures</h4>
                  <div className="space-y-1.5 text-slate-650 dark:text-slate-350">
                    <div className="flex justify-between"><span>Diabetes:</span> <strong className="text-slate-900 dark:text-slate-100">{inspectPatient.patientHealthData.hasDiabetes ? "YES" : "NO"}</strong></div>
                    <div className="flex justify-between"><span>Allergies:</span> <strong className="text-slate-900 dark:text-slate-100">{inspectPatient.patientHealthData.hasAllergies ? "YES" : "NO"}</strong></div>
                    <div className="flex justify-between"><span>Dietary Pref:</span> <strong className="text-slate-900 dark:text-slate-100">{inspectPatient.patientHealthData.dietaryPreferences}</strong></div>
                    <div className="flex justify-between"><span>Smoking Status:</span> <strong className="text-slate-900 dark:text-slate-100">{inspectPatient.patientHealthData.smokingStatus ? "YES" : "NO"}</strong></div>
                    <div className="flex justify-between"><span>Anxiety Indicator:</span> <strong className="text-slate-900 dark:text-slate-100">{inspectPatient.patientHealthData.recentAnxiety ? "YES" : "NO"}</strong></div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-slate-400 text-xs italic">No health records compiled by patient.</p>
            )}

            {/* Medical reports list */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-850">
              <h4 className="font-bold text-[10px] text-slate-400 uppercase tracking-wider">Uploaded Medical Reports</h4>
              {inspectPatient.medicalReports && inspectPatient.medicalReports.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {inspectPatient.medicalReports.map((rep: any) => (
                    <div key={rep.id} className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="h-4 w-4 text-slate-400 flex-shrink-0" />
                        <span className="font-bold text-slate-700 dark:text-slate-350 truncate">{rep.reportName}</span>
                      </div>
                      <a href="#" onClick={(e) => { e.preventDefault(); alert("Simulating report review..."); }} className="text-primary hover:underline font-bold flex-shrink-0">Review</a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-xs italic">No medical reports uploaded.</p>
              )}
            </div>

            <div className="flex gap-2 justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
              <button type="button" onClick={() => setPatientRecordModalOpen(false)} className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-750 px-5 py-2 rounded-xl font-bold">Close File</button>
            </div>
          </div>
        )}
      </CustomModal>

      {/* Video consultation calling modal screen */}
      <CustomModal
        isOpen={videoCallModalOpen}
        onClose={handleEndVideoCall}
        title="Live Video Consultation Call"
        size="xl"
      >
        {videoCallAppt && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[500px]">
            {/* Left: Video Blocks Frame (8 cols) */}
            <div className="lg:col-span-8 bg-slate-950 rounded-2xl overflow-hidden relative flex flex-col items-center justify-center border border-slate-900 shadow-inner">
              
              {/* Main remote video screen (Doctor view if Patient caller, and vice versa) */}
              <div className="absolute inset-0 z-0">
                {!stopVideo ? (
                  <img
                    src={activeRole === Role.PATIENT 
                      ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400"
                      : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"
                    }
                    alt="Remote consultation stream"
                    className="w-full h-full object-cover opacity-80"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-550 text-xs">
                    Video Paused
                  </div>
                )}
              </div>

              {/* Local Video Stream Picture-in-Picture */}
              <div className="absolute top-4 right-4 h-32 w-24 rounded-lg bg-slate-900 overflow-hidden border border-slate-800 shadow-lg z-10">
                <img
                  src={activeRole === Role.PATIENT
                    ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
                    : "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200"
                  }
                  alt="Local stream"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Call HUD Overlay */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md px-6 py-3 rounded-2xl border border-slate-800 flex items-center gap-4 z-20 shadow-xl text-xs font-bold text-white">
                <span className="font-mono">{formatTimer(callTimer)}</span>
                <span className="text-slate-800">|</span>
                <button
                  type="button"
                  onClick={() => setMuteAudio(!muteAudio)}
                  className={`p-1.5 rounded-lg cursor-pointer ${muteAudio ? "bg-rose-500 text-white" : "hover:bg-slate-800 text-slate-400"}`}
                >
                  Mute
                </button>
                <button
                  type="button"
                  onClick={() => setStopVideo(!stopVideo)}
                  className={`p-1.5 rounded-lg cursor-pointer ${stopVideo ? "bg-rose-500 text-white" : "hover:bg-slate-800 text-slate-400"}`}
                >
                  Stop Cam
                </button>
                <button
                  type="button"
                  onClick={handleEndVideoCall}
                  className="bg-rose-500 text-white hover:bg-rose-650 px-4 py-1.5 rounded-xl transition-colors cursor-pointer"
                >
                  End Session
                </button>
              </div>
            </div>

            {/* Right: Notes / Write Prescription Side panel (4 cols) */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 p-4 rounded-2xl shadow-xs flex flex-col justify-between overflow-hidden">
              <div className="space-y-4 flex-grow overflow-y-auto pr-1">
                <div className="pb-3 border-b border-slate-100 dark:border-slate-850">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Active Case File</h4>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Patient: {videoCallAppt.patient.name}</span>
                </div>

                {activeRole === Role.DOCTOR ? (
                  <div className="space-y-3 text-xs">
                    <div className="space-y-1">
                      <label className="block text-[9px] font-bold text-slate-450 uppercase">Clinical Prescriptions</label>
                      <textarea
                        rows={6}
                        value={prescriptionInstructions}
                        onChange={(e) => setPrescriptionInstructions(e.target.value)}
                        placeholder="Type instructions here to prescribe and complete the session..."
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 resize-none text-xs focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[9px] font-bold text-slate-450 uppercase">Follow-Up Date</label>
                      <input
                        type="date"
                        value={prescriptionFollowUp}
                        onChange={(e) => setPrescriptionFollowUp(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 text-xs"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 text-xs text-slate-500 dark:text-slate-400 pt-2 leading-relaxed">
                    <p>You are now connected to a secure, end-to-end encrypted video session with your specialist.</p>
                    <p>Consultations are recorded for billing audits. Speak clearly and disclose all medical conditions, histories, and allergies.</p>
                    <p>Your doctor will write instructions here which will appear directly in your prescriptions archive once the call ends.</p>
                  </div>
                )}
              </div>

              {activeRole === Role.DOCTOR && (
                <button
                  type="button"
                  onClick={() => {
                    if (!prescriptionInstructions) {
                      alert("Please type clinical instructions before finalizing prescription.");
                      return;
                    }
                    writePrescription(videoCallAppt.id, prescriptionInstructions, prescriptionFollowUp || "2026-06-30");
                    setVideoCallModalOpen(false);
                    setVideoCallAppt(null);
                    alert("Prescription submitted. Consultation finished.");
                  }}
                  className="mt-4 w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-xl font-bold shadow-md cursor-pointer text-xs"
                >
                  Finalize Case Case
                </button>
              )}
            </div>
          </div>
        )}
      </CustomModal>
    </>
  );
}

export default function UnifiedDashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}

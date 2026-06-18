"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/providers/authProvider";
import { CustomModal } from "@/components/ui/custom-modal";
import { toast } from "sonner";
import { DatePicker } from "@/components/ui/date-picker";
import { 
  Role, 
  Gender, 
  BloodGroup,
  Appointment,
  Patient,
  Doctor,
  MedicalReport
} from "@/types";
import { 
  Star, 
  FileText 
} from "lucide-react";

import { PatientDashboard } from "./PatientDashboard";
import { DoctorDashboard } from "./DoctorDashboard";
import { AdminDashboard } from "./AdminDashboard";
import { SuperAdminDashboard } from "./SuperAdminDashboard";

export function DashboardContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";

  const {
    activeRole,
    currentProfile,
    appointments,
    prescriptions,
    reviews,
    schedules,
    patients,
    doctors,
    specialties,
    // Actions
    bookAppointment,
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
    writePrescription
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
  const [inspectPatient, setInspectPatient] = useState<Patient | null>(null);

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

  // Load Patient Profile inputs when tab is profile
  useEffect(() => {
    if (activeRole === Role.PATIENT && currentProfile) {
      const p = currentProfile as Patient;
      const timer = setTimeout(() => {
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
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [currentProfile, activeRole, activeTab]);

  // Video call duration simulation
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (videoCallModalOpen) {
      interval = setInterval(() => {
        setCallTimer((prev) => prev + 1);
      }, 1000);
    } else {
      const timer = setTimeout(() => {
        setCallTimer(0);
      }, 0);
      return () => clearTimeout(timer);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
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
    toast.success("Health profile updated successfully in memory.");
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
  const renderSelectedDashboardView = () => {
    switch (activeRole) {
      case Role.PATIENT:
        return (
          <PatientDashboard
            activeTab={activeTab}
            currentProfile={currentProfile as Patient}
            patientAppointments={patientAppointments}
            patientReviews={patientReviews}
            patientPrescriptions={patientPrescriptions}
            patName={patName}
            setPatName={setPatName}
            patPhone={patPhone}
            setPatPhone={setPatPhone}
            patAddress={patAddress}
            setPatAddress={setPatAddress}
            patGender={patGender}
            setPatGender={setPatGender}
            patBlood={patBlood}
            setPatBlood={setPatBlood}
            patDob={patDob}
            setPatDob={setPatDob}
            patHeight={patHeight}
            setPatHeight={setPatHeight}
            patWeight={patWeight}
            setPatWeight={setPatWeight}
            patAllergies={patAllergies}
            setPatAllergies={setPatAllergies}
            patDiabetes={patDiabetes}
            setPatDiabetes={setPatDiabetes}
            patSmoking={patSmoking}
            setPatSmoking={setPatSmoking}
            patDiet={patDiet}
            setPatDiet={setPatDiet}
            patMarital={patMarital}
            setPatMarital={setPatMarital}
            patHistory={patHistory}
            setPatHistory={setPatHistory}
            reportFileName={reportFileName}
            setReportFileName={setReportFileName}
            doctors={doctors}
            specialties={specialties}
            schedules={schedules}
            bookAppointment={bookAppointment}
            handleProfileSave={handleProfileSave}
            handleReportUploadSubmit={handleReportUploadSubmit}
            deleteMedicalReport={deleteMedicalReport}
            handleTriggerVideoCall={handleTriggerVideoCall}
            initiatePayment={initiatePayment}
            cancelAppointment={cancelAppointment}
            triggerReviewModal={triggerReviewModal}
          />
        );
      case Role.DOCTOR:
        return (
          <DoctorDashboard
            activeTab={activeTab}
            doctorAppointments={doctorAppointments}
            doctorReviews={doctorReviews}
            doctorPrescriptions={doctorPrescriptions}
            schedules={schedules}
            currentProfile={currentProfile as Doctor}
            handleTriggerVideoCall={handleTriggerVideoCall}
            triggerPrescriptionModal={triggerPrescriptionModal}
            cancelAppointment={cancelAppointment}
            releaseSlot={releaseSlot}
            claimSlot={claimSlot}
            triggerPatientRecordModal={triggerPatientRecordModal}
          />
        );
      case Role.ADMIN:
        return <AdminDashboard activeTab={activeTab} />;
      case Role.SUPER_ADMIN:
        return <SuperAdminDashboard activeTab={activeTab} />;
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
                  className="p-1 hover:scale-110 text-amber-405 transition-transform cursor-pointer"
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
            <DatePicker
              value={prescriptionFollowUp}
              onChange={setPrescriptionFollowUp}
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
            <div className="flex gap-4 items-center pb-4 border-b border-slate-100 dark:border-slate-855">
              <div className="h-14 w-14 rounded-full bg-slate-100 overflow-hidden border border-slate-100 dark:border-slate-700">
                <img
                  src={inspectPatient.profilePhoto || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=60"}
                  alt={inspectPatient.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{inspectPatient.name}</h3>
                <span className="text-slate-505 font-medium block">Contact: {inspectPatient.contactNumber || "N/A"} &bull; {inspectPatient.email}</span>
              </div>
            </div>

            {inspectPatient.patientHealthData ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-bold text-[10px] text-slate-400 uppercase tracking-wider">Demographic Metrics</h4>
                  <div className="space-y-1.5 text-slate-605 dark:text-slate-350">
                    <div className="flex justify-between"><span>Gender:</span> <strong className="text-slate-900 dark:text-slate-100">{inspectPatient.patientHealthData.gender}</strong></div>
                    <div className="flex justify-between"><span>Blood Group:</span> <strong className="text-slate-900 dark:text-slate-100">{inspectPatient.patientHealthData.bloodGroup}</strong></div>
                    <div className="flex justify-between"><span>Height:</span> <strong className="text-slate-900 dark:text-slate-100">{inspectPatient.patientHealthData.height}</strong></div>
                    <div className="flex justify-between"><span>Weight:</span> <strong className="text-slate-900 dark:text-slate-100">{inspectPatient.patientHealthData.weight}</strong></div>
                    <div className="flex justify-between"><span>Marital Status:</span> <strong className="text-slate-900 dark:text-slate-100">{inspectPatient.patientHealthData.maritalStatus}</strong></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-[10px] text-slate-450 uppercase tracking-wider">Clinical Disclosures</h4>
                  <div className="space-y-1.5 text-slate-605 dark:text-slate-350">
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
                  {inspectPatient.medicalReports.map((rep: MedicalReport) => (
                    <div key={rep.id} className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-805 flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="h-4 w-4 text-slate-400 flex-shrink-0" />
                        <span className="font-bold text-slate-700 dark:text-slate-350 truncate">{rep.reportName}</span>
                      </div>
                      <a href="#" onClick={(e) => { e.preventDefault(); toast.info("Simulating report review..."); }} className="text-primary hover:underline font-bold flex-shrink-0">Review</a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-405 text-xs italic">No medical reports uploaded.</p>
              )}
            </div>

            <div className="flex gap-2 justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
              <button type="button" onClick={() => setPatientRecordModalOpen(false)} className="bg-slate-100 hover:bg-slate-205 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-750 px-5 py-2 rounded-xl font-bold">Close File</button>
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
                  <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-500 text-xs">
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
                      <label className="block text-[9px] font-bold text-slate-455 uppercase">Follow-Up Date</label>
                      <DatePicker
                        value={prescriptionFollowUp}
                        onChange={setPrescriptionFollowUp}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 text-xs text-slate-500 dark:text-slate-400 pt-2 leading-relaxed">
                    <p>You are now connected to a secure, end-to-end encrypted video session with your specialist.</p>
                    <p>Consultations are central central centralcentral central CentralCentral CentralcentralCentral central Centralcentral Centralcentral metrics. Speak clearly and disclose all medical conditions, histories, and allergies.</p>
                    <p>Your doctor will write instructions here which will appear directly in your prescriptions archive once the call ends.</p>
                  </div>
                )}
              </div>

              {activeRole === Role.DOCTOR && (
                <button
                  type="button"
                  onClick={() => {
                    if (!prescriptionInstructions) {
                      toast.error("Please type clinical instructions before finalizing prescription.");
                      return;
                    }
                    writePrescription(videoCallAppt.id, prescriptionInstructions, prescriptionFollowUp || "2026-06-30");
                    setVideoCallModalOpen(false);
                    setVideoCallAppt(null);
                    toast.success("Prescription submitted. Consultation finished.");
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

"use client";

import React, { useState } from "react";
import { useAuth } from "@/providers/authProvider";
import { DoctorAppointments } from "@/features/dashboard/doctor/components/DoctorAppointments";
import { VideoCallModal } from "@/components/shared/VideoCallModal";
import { PrescriptionModal } from "@/components/shared/PrescriptionModal";
import { PatientRecordModal } from "@/components/shared/PatientRecordModal";
import { Appointment, Patient } from "@/types";

export default function DoctorAppointmentsPage() {
  const { appointments, patients, currentProfile, cancelAppointment } = useAuth();

  const [videoCallModalOpen, setVideoCallModalOpen] = useState(false);
  const [activeVideoAppt, setActiveVideoAppt] = useState<Appointment | null>(null);

  const [prescriptionModalOpen, setPrescriptionModalOpen] = useState(false);
  const [activePrescriptionApptId, setActivePrescriptionApptId] = useState<string | null>(null);

  const [patientRecordModalOpen, setPatientRecordModalOpen] = useState(false);
  const [activeInspectPatient, setActiveInspectPatient] = useState<Patient | null>(null);

  const handleTriggerVideoCall = (appt: Appointment) => {
    setActiveVideoAppt(appt);
    setVideoCallModalOpen(true);
  };

  const triggerPrescriptionModal = (apptId: string) => {
    setActivePrescriptionApptId(apptId);
    setPrescriptionModalOpen(true);
  };

  const triggerPatientRecordModal = (patientEmail: string) => {
    const pat = patients.find((p) => p.email === patientEmail);
    if (pat) {
      setActiveInspectPatient(pat);
      setPatientRecordModalOpen(true);
    }
  };

  const doctorAppointments = appointments.filter(
    (a) => a.doctorId === currentProfile?.id
  );

  return (
    <>
      <DoctorAppointments
        doctorAppointments={doctorAppointments}
        handleTriggerVideoCall={handleTriggerVideoCall}
        triggerPrescriptionModal={triggerPrescriptionModal}
        cancelAppointment={cancelAppointment}
        triggerPatientRecordModal={triggerPatientRecordModal}
      />
      <VideoCallModal
        isOpen={videoCallModalOpen}
        onClose={() => setVideoCallModalOpen(false)}
        appointment={activeVideoAppt}
      />
      <PrescriptionModal
        isOpen={prescriptionModalOpen}
        onClose={() => setPrescriptionModalOpen(false)}
        appointmentId={activePrescriptionApptId}
      />
      <PatientRecordModal
        isOpen={patientRecordModalOpen}
        onClose={() => setPatientRecordModalOpen(false)}
        patient={activeInspectPatient}
      />
    </>
  );
}

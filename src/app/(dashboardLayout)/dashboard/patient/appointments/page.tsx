"use client";

import React, { useState } from "react";
import { useAuth } from "@/providers/authProvider";
import { PatientAppointments } from "@/features/dashboard/patient/components/PatientAppointments";
import { VideoCallModal } from "@/components/shared/VideoCallModal";
import { ReviewModal } from "@/components/shared/ReviewModal";
import { Appointment } from "@/types";

export default function PatientAppointmentsPage() {
  const { appointments, currentProfile, initiatePayment, cancelAppointment } = useAuth();
  
  const [videoCallModalOpen, setVideoCallModalOpen] = useState(false);
  const [activeVideoAppt, setActiveVideoAppt] = useState<Appointment | null>(null);

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [activeAppointmentId, setActiveAppointmentId] = useState<string | null>(null);

  const handleTriggerVideoCall = (appt: Appointment) => {
    setActiveVideoAppt(appt);
    setVideoCallModalOpen(true);
  };

  const triggerReviewModal = (id: string) => {
    setActiveAppointmentId(id);
    setReviewModalOpen(true);
  };

  const patientAppointments = appointments.filter(
    (a) => a.patientId === currentProfile?.id
  );

  return (
    <>
      <PatientAppointments
        patientAppointments={patientAppointments}
        handleTriggerVideoCall={handleTriggerVideoCall}
        initiatePayment={initiatePayment}
        cancelAppointment={cancelAppointment}
        triggerReviewModal={triggerReviewModal}
      />
      <VideoCallModal
        isOpen={videoCallModalOpen}
        onClose={() => setVideoCallModalOpen(false)}
        appointment={activeVideoAppt}
      />
      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        appointmentId={activeAppointmentId}
      />
    </>
  );
}

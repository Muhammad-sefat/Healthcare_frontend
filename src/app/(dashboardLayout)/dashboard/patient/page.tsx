"use client";

import React, { useState } from "react";
import { useAuth } from "@/providers/authProvider";
import { PatientOverview } from "@/features/dashboard/patient/components/PatientOverview";
import { VideoCallModal } from "@/components/shared/VideoCallModal";
import { Appointment } from "@/types";

export default function PatientOverviewPage() {
  const { appointments, reviews, currentProfile, initiatePayment } = useAuth();
  const [videoCallModalOpen, setVideoCallModalOpen] = useState(false);
  const [activeVideoAppt, setActiveVideoAppt] = useState<Appointment | null>(null);

  const handleTriggerVideoCall = (appt: Appointment) => {
    setActiveVideoAppt(appt);
    setVideoCallModalOpen(true);
  };

  const patientAppointments = appointments.filter(
    (a) => a.patientId === currentProfile?.id
  );
  const patientReviews = reviews.filter(
    (r) => r.patient?.name === currentProfile?.name
  );

  return (
    <>
      <PatientOverview
        patientAppointments={patientAppointments}
        patientReviews={patientReviews}
        handleTriggerVideoCall={handleTriggerVideoCall}
        initiatePayment={initiatePayment}
      />
      <VideoCallModal
        isOpen={videoCallModalOpen}
        onClose={() => setVideoCallModalOpen(false)}
        appointment={activeVideoAppt}
      />
    </>
  );
}

"use client";

import React, { useState } from "react";
import { useAuth } from "@/providers/authProvider";
import { DoctorOverview } from "@/features/dashboard/doctor/components/DoctorOverview";
import { VideoCallModal } from "@/components/shared/VideoCallModal";
import { Appointment } from "@/types";

export default function DoctorOverviewPage() {
  const { appointments, reviews, currentProfile } = useAuth();
  const [videoCallModalOpen, setVideoCallModalOpen] = useState(false);
  const [activeVideoAppt, setActiveVideoAppt] = useState<Appointment | null>(null);

  const handleTriggerVideoCall = (appt: Appointment) => {
    setActiveVideoAppt(appt);
    setVideoCallModalOpen(true);
  };

  const doctorAppointments = appointments.filter(
    (a) => a.doctorId === currentProfile?.id
  );
  const doctorReviews = reviews.filter(
    (r) => r.doctorId === currentProfile?.id
  );

  return (
    <>
      <DoctorOverview
        doctorAppointments={doctorAppointments}
        doctorReviews={doctorReviews}
        handleTriggerVideoCall={handleTriggerVideoCall}
      />
      <VideoCallModal
        isOpen={videoCallModalOpen}
        onClose={() => setVideoCallModalOpen(false)}
        appointment={activeVideoAppt}
      />
    </>
  );
}

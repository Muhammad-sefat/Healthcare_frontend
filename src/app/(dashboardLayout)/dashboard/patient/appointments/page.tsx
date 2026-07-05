"use client";

import React, { useState } from "react";
import { 
  useGetPatientAppointments, 
  useInitiatePayment, 
  useCancelAppointment 
} from "@/features/dashboard/patient/hooks/usePatientAppointments";
import { PatientAppointments } from "@/features/dashboard/patient/components/PatientAppointments";
import { VideoCallModal } from "@/components/shared/VideoCallModal";
import { ReviewModal } from "@/components/shared/ReviewModal";
import { Appointment } from "@/types";

export default function PatientAppointmentsPage() {
  const { data: response, isLoading } = useGetPatientAppointments();
  const initiatePaymentMutation = useInitiatePayment();
  const cancelAppointmentMutation = useCancelAppointment();
  
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

  const handleInitiatePayment = (id: string) => {
    initiatePaymentMutation.mutate(id);
  };

  const handleCancelAppointment = (id: string) => {
    handleCancelAppointmentWithConfirmation(id);
  };

  const handleCancelAppointmentWithConfirmation = (id: string) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      cancelAppointmentMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="h-8 w-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const patientAppointments = response?.data || [];

  return (
    <>
      <PatientAppointments
        patientAppointments={patientAppointments}
        handleTriggerVideoCall={handleTriggerVideoCall}
        initiatePayment={handleInitiatePayment}
        cancelAppointment={handleCancelAppointment}
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

"use client";

import React from "react";
import { useAuth } from "@/providers/authProvider";
import { BookConsultation } from "@/features/dashboard/patient/components/BookConsultation";

export default function BookConsultationPage() {
  const { doctors, schedules, bookAppointment } = useAuth();

  return (
    <BookConsultation
      doctors={doctors}
      schedules={schedules}
      bookAppointment={bookAppointment}
    />
  );
}

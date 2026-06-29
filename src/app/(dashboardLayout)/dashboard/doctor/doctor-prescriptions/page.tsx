"use client";

import React from "react";
import { useAuth } from "@/providers/authProvider";
import { DoctorPrescriptions } from "@/features/dashboard/doctor/components/DoctorPrescriptions";

export default function DoctorPrescriptionsPage() {
  const { prescriptions, currentProfile } = useAuth();

  const doctorPrescriptions = prescriptions.filter(
    (p) => p.doctor?.name === currentProfile?.name
  );

  return (
    <DoctorPrescriptions
      doctorPrescriptions={doctorPrescriptions}
    />
  );
}

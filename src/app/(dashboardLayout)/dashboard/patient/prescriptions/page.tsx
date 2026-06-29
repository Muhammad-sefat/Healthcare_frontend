"use client";

import React from "react";
import { useAuth } from "@/providers/authProvider";
import { PatientPrescriptions } from "@/features/dashboard/patient/components/PatientPrescriptions";

export default function PatientPrescriptionsPage() {
  const { prescriptions, currentProfile } = useAuth();

  const patientPrescriptions = prescriptions.filter(
    (p) => p.patient?.name === currentProfile?.name
  );

  return (
    <PatientPrescriptions
      patientPrescriptions={patientPrescriptions}
    />
  );
}

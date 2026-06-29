"use client";

import React from "react";
import { useAuth } from "@/providers/authProvider";
import { BillingAudit } from "@/features/dashboard/admin/components/BillingAudit";

export default function BillingAuditPage() {
  const { appointments, updateAppointmentStatus } = useAuth();

  return (
    <BillingAudit
      appointments={appointments}
      updateAppointmentStatus={updateAppointmentStatus}
    />
  );
}

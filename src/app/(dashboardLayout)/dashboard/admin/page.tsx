"use client";

import React from "react";
import { useAuth } from "@/providers/authProvider";
import { AdminOverview } from "@/features/dashboard/admin/components/AdminOverview";

export default function AdminOverviewPage() {
  const { appointments, users, doctors } = useAuth();

  return (
    <AdminOverview
      appointments={appointments}
      users={users}
      doctors={doctors}
    />
  );
}

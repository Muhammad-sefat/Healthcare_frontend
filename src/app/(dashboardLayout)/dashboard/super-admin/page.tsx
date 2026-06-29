"use client";

import React from "react";
import { useAuth } from "@/providers/authProvider";
import { SuperAdminOverview } from "@/features/dashboard/super-admin/components/SuperAdminOverview";

export default function SuperAdminOverviewPage() {
  const { users, admins } = useAuth();

  return (
    <SuperAdminOverview
      users={users}
      admins={admins}
    />
  );
}

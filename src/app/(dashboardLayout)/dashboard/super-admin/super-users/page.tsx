"use client";

import React from "react";
import { useAuth } from "@/providers/authProvider";
import { UserControls } from "@/features/dashboard/super-admin/components/UserControls";

export default function UserControlsPage() {
  const { users, currentProfile, changeUserStatus, changeUserRole } = useAuth();

  return (
    <UserControls
      users={users}
      currentProfile={currentProfile}
      changeUserStatus={changeUserStatus}
      changeUserRole={changeUserRole}
    />
  );
}

"use client";

import React from "react";
import { useAuth } from "@/providers/authProvider";
import { UserModeration } from "@/features/dashboard/admin/components/UserModeration";

export default function UserModerationPage() {
  const { users, changeUserStatus } = useAuth();

  return (
    <UserModeration
      users={users}
      changeUserStatus={changeUserStatus}
    />
  );
}

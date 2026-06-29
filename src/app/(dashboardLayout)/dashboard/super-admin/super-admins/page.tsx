"use client";

import React from "react";
import { useAuth } from "@/providers/authProvider";
import { CreateAdmin } from "@/features/dashboard/super-admin/components/CreateAdmin";

export default function CreateAdminPage() {
  const { admins, createAdmin, deleteAdmin } = useAuth();

  return (
    <CreateAdmin
      admins={admins}
      createAdmin={createAdmin}
      deleteAdmin={deleteAdmin}
    />
  );
}

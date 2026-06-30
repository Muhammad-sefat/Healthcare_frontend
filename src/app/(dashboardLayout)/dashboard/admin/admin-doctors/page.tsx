"use client";

import React from "react";
import { useAuth } from "@/providers/authProvider";
import { DoctorDirectory } from "@/features/dashboard/admin/components/DoctorDirectory";

export default function DoctorDirectoryPage() {
  const { doctors, registerDoctor, deleteDoctor } = useAuth();

  return (
    <DoctorDirectory
      doctors={doctors}
      registerDoctor={registerDoctor}
      deleteDoctor={deleteDoctor}
    />
  );
}

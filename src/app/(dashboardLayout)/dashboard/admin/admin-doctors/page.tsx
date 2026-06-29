"use client";

import React from "react";
import { useAuth } from "@/providers/authProvider";
import { DoctorDirectory } from "@/features/dashboard/admin/components/DoctorDirectory";

export default function DoctorDirectoryPage() {
  const { doctors, specialties, registerDoctor, deleteDoctor } = useAuth();

  return (
    <DoctorDirectory
      doctors={doctors}
      specialties={specialties}
      registerDoctor={registerDoctor}
      deleteDoctor={deleteDoctor}
    />
  );
}

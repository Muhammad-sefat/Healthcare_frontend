"use client";

import React from "react";
import { useAuth } from "@/providers/authProvider";
import { SpecialtyRegistry } from "@/features/dashboard/admin/components/SpecialtyRegistry";

export default function SpecialtyRegistryPage() {
  const { specialties, addSpecialty, deleteSpecialty } = useAuth();

  return (
    <SpecialtyRegistry
      specialties={specialties}
      addSpecialty={addSpecialty}
      deleteSpecialty={deleteSpecialty}
    />
  );
}

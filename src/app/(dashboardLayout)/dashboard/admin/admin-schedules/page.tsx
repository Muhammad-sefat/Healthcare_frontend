"use client";

import React from "react";
import { useAuth } from "@/providers/authProvider";
import { GenerateSchedules } from "@/features/dashboard/admin/components/GenerateSchedules";

export default function GenerateSchedulesPage() {
  return (
    <GenerateSchedules />
  );
}

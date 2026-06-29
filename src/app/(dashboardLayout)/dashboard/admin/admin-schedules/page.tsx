"use client";

import React from "react";
import { useAuth } from "@/providers/authProvider";
import { GenerateSchedules } from "@/features/dashboard/admin/components/GenerateSchedules";

export default function GenerateSchedulesPage() {
  const { schedules, generateSchedules } = useAuth();

  return (
    <GenerateSchedules
      schedules={schedules}
      generateSchedules={generateSchedules}
    />
  );
}

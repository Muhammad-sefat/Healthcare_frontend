"use client";

import React from "react";
import { useAuth } from "@/providers/authProvider";
import { ManageSlots } from "@/features/dashboard/doctor/components/ManageSlots";
import { Doctor } from "@/types";

export default function ManageSlotsPage() {
  const { schedules, currentProfile, claimSlot, releaseSlot } = useAuth();

  return (
    <ManageSlots
      schedules={schedules}
      currentProfile={currentProfile as Doctor | null}
      claimSlot={claimSlot}
      releaseSlot={releaseSlot}
    />
  );
}

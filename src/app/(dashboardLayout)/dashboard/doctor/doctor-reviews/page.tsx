"use client";

import React from "react";
import { useAuth } from "@/providers/authProvider";
import { DoctorReviews } from "@/features/dashboard/doctor/components/DoctorReviews";

export default function DoctorReviewsPage() {
  const { reviews, currentProfile } = useAuth();

  const doctorReviews = reviews.filter(
    (r) => r.doctorId === currentProfile?.id
  );

  return (
    <DoctorReviews
      doctorReviews={doctorReviews}
    />
  );
}

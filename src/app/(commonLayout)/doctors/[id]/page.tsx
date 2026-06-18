import React from "react";
import DoctorDetailPage from "@/features/doctors/pages/DoctorDetailPage";

export default function DoctorDetails({ params }: { params: Promise<{ id: string }> }) {
  return <DoctorDetailPage params={params} />;
}

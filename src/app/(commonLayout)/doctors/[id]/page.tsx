import React from "react";
import { DoctorDetailView } from "@/features/doctors/components/DoctorDetailView";

export default function DoctorDetails({ params }: { params: Promise<{ id: string }> }) {
  return <DoctorDetailView params={params} />;
}

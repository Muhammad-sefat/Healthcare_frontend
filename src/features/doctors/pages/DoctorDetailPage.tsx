import React from "react";
import { DoctorDetailView } from "../components/DoctorDetailView";

export function DoctorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return <DoctorDetailView params={params} />;
}
export default DoctorDetailPage;
